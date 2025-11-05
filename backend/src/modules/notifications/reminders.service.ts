import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReminderRule, ReminderEventType } from './entities/reminder-rule.entity';
import { ReminderDelivery } from './entities/reminder-rule.entity';
import { CreateReminderRuleDto, UpdateReminderRuleDto } from './dto/create-reminder-rule.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(ReminderRule)
    private reminderRuleRepository: Repository<ReminderRule>,
    @InjectRepository(ReminderDelivery)
    private reminderDeliveryRepository: Repository<ReminderDelivery>,
  ) {}

  /**
   * Create a reminder rule for a user
   */
  async createRule(
    userId: string,
    createDto: CreateReminderRuleDto,
  ): Promise<ReminderRule> {
    const rule = this.reminderRuleRepository.create({
      userId,
      ...createDto,
    });
    return this.reminderRuleRepository.save(rule);
  }

  /**
   * Get all rules for a user
   */
  async getUserRules(userId: string): Promise<ReminderRule[]> {
    return this.reminderRuleRepository.find({
      where: { userId },
      order: { eventType: 'ASC' },
    });
  }

  /**
   * Update a reminder rule
   */
  async updateRule(
    ruleId: string,
    updateDto: UpdateReminderRuleDto,
  ): Promise<ReminderRule> {
    const rule = await this.reminderRuleRepository.findOne({
      where: { id: ruleId },
    });

    if (!rule) {
      throw new NotFoundException('Reminder rule not found');
    }

    Object.assign(rule, updateDto);
    return this.reminderRuleRepository.save(rule);
  }

  /**
   * Delete a reminder rule
   */
  async deleteRule(ruleId: string): Promise<void> {
    const result = await this.reminderRuleRepository.delete(ruleId);
    if (result.affected === 0) {
      throw new NotFoundException('Reminder rule not found');
    }
  }

  /**
   * Send a reminder
   */
  async sendReminder(
    ruleId: string,
    message: string,
    relatedEntityId?: string,
  ): Promise<ReminderDelivery> {
    const rule = await this.reminderRuleRepository.findOne({
      where: { id: ruleId },
    });

    if (!rule || !rule.isActive) {
      throw new NotFoundException('Reminder rule not found or inactive');
    }

    const delivery = this.reminderDeliveryRepository.create({
      ruleId,
      userId: rule.userId,
      message,
      relatedEntityId: relatedEntityId || null,
    });

    return this.reminderDeliveryRepository.save(delivery);
  }

  /**
   * Mark reminder as opened
   */
  async markOpened(deliveryId: string): Promise<ReminderDelivery> {
    const delivery = await this.reminderDeliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException('Reminder delivery not found');
    }

    delivery.openedAt = new Date();
    return this.reminderDeliveryRepository.save(delivery);
  }

  /**
   * Mark reminder as acted upon
   */
  async markActedUpon(deliveryId: string): Promise<ReminderDelivery> {
    const delivery = await this.reminderDeliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException('Reminder delivery not found');
    }

    delivery.actedUponAt = new Date();

    // Update rule effectiveness
    await this.updateRuleEffectiveness(delivery.ruleId, true);

    return this.reminderDeliveryRepository.save(delivery);
  }

  /**
   * Mark reminder as dismissed
   */
  async markDismissed(deliveryId: string): Promise<ReminderDelivery> {
    const delivery = await this.reminderDeliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException('Reminder delivery not found');
    }

    delivery.dismissedAt = new Date();

    // Update rule effectiveness
    await this.updateRuleEffectiveness(delivery.ruleId, false);

    return this.reminderDeliveryRepository.save(delivery);
  }

  /**
   * Update rule effectiveness based on user response
   */
  private async updateRuleEffectiveness(
    ruleId: string,
    wasEffective: boolean,
  ): Promise<void> {
    const rule = await this.reminderRuleRepository.findOne({
      where: { id: ruleId },
    });

    if (!rule) return;

    // Simple moving average: adjust effectiveness by ±5
    const adjustment = wasEffective ? 5 : -5;
    rule.effectiveness = Math.max(0, Math.min(100, rule.effectiveness + adjustment));

    await this.reminderRuleRepository.save(rule);
  }

  /**
   * Get reminder history for a user
   */
  async getReminderHistory(
    userId: string,
    limit: number = 50,
  ): Promise<ReminderDelivery[]> {
    return this.reminderDeliveryRepository.find({
      where: { userId },
      order: { sentAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get suggested reminder settings based on patterns
   */
  async getSuggestedSettings(userId: string): Promise<{
    optimalAdvanceTime: number;
    preferredDeliveryMethod: string;
    recommendedTone: string;
  }> {
    const deliveries = await this.reminderDeliveryRepository.find({
      where: { userId },
      relations: ['rule'],
      take: 100,
    });

    if (deliveries.length === 0) {
      return {
        optimalAdvanceTime: 30, // Default 30 minutes
        preferredDeliveryMethod: 'PUSH',
        recommendedTone: 'NEUTRAL',
      };
    }

    // Calculate which settings led to most actions
    const actedUpon = deliveries.filter((d) => d.actedUponAt !== null);

    // Find most effective advance time
    const advanceTimes = actedUpon.map((d) => d.rule.advanceMinutes);
    const optimalAdvanceTime = advanceTimes.length > 0
      ? Math.round(advanceTimes.reduce((a, b) => a + b, 0) / advanceTimes.length)
      : 30;

    // Find most effective delivery method (simplified)
    const preferredDeliveryMethod = 'PUSH';

    // Find most effective tone
    const recommendedTone = 'NEUTRAL';

    return {
      optimalAdvanceTime,
      preferredDeliveryMethod,
      recommendedTone,
    };
  }
}
