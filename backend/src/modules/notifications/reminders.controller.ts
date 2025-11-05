import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RemindersService } from './reminders.service';
import { CreateReminderRuleDto, UpdateReminderRuleDto } from './dto/create-reminder-rule.dto';

@ApiTags('Reminders')
@Controller('api/reminders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post('rules')
  @ApiOperation({ summary: 'Create a reminder rule' })
  async createRule(@Request() req, @Body() createDto: CreateReminderRuleDto) {
    return this.remindersService.createRule(req.user.userId, createDto);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get user reminder rules' })
  async getUserRules(@Request() req) {
    return this.remindersService.getUserRules(req.user.userId);
  }

  @Patch('rules/:id')
  @ApiOperation({ summary: 'Update a reminder rule' })
  async updateRule(@Param('id') ruleId: string, @Body() updateDto: UpdateReminderRuleDto) {
    return this.remindersService.updateRule(ruleId, updateDto);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete a reminder rule' })
  async deleteRule(@Param('id') ruleId: string) {
    await this.remindersService.deleteRule(ruleId);
    return { message: 'Reminder rule deleted' };
  }

  @Patch('deliveries/:id/opened')
  @ApiOperation({ summary: 'Mark reminder as opened' })
  async markOpened(@Param('id') deliveryId: string) {
    return this.remindersService.markOpened(deliveryId);
  }

  @Patch('deliveries/:id/acted-upon')
  @ApiOperation({ summary: 'Mark reminder as acted upon' })
  async markActedUpon(@Param('id') deliveryId: string) {
    return this.remindersService.markActedUpon(deliveryId);
  }

  @Patch('deliveries/:id/dismissed')
  @ApiOperation({ summary: 'Mark reminder as dismissed' })
  async markDismissed(@Param('id') deliveryId: string) {
    return this.remindersService.markDismissed(deliveryId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get reminder history' })
  async getHistory(@Request() req, @Query('limit') limit?: number) {
    return this.remindersService.getReminderHistory(req.user.userId, limit);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get suggested reminder settings' })
  async getSuggestions(@Request() req) {
    return this.remindersService.getSuggestedSettings(req.user.userId);
  }
}
