import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccessibilityService } from './accessibility.service';
import { UpdateAccessibilityProfileDto } from './dto/update-accessibility-profile.dto';
import { AccessibilityProfile } from './entities/accessibility-profile.entity';

@ApiTags('Accessibility')
@Controller('api/accessibility')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccessibilityController {
  constructor(private readonly accessibilityService: AccessibilityService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user accessibility profile' })
  @ApiResponse({
    status: 200,
    description: 'Accessibility profile retrieved successfully',
  })
  async getMyProfile(@Request() req: any): Promise<AccessibilityProfile> {
    return this.accessibilityService.getProfile(req.user.userId);
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get user accessibility profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Accessibility profile retrieved successfully',
  })
  async getProfile(@Param('userId') userId: string): Promise<AccessibilityProfile> {
    return this.accessibilityService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user accessibility profile' })
  @ApiResponse({
    status: 200,
    description: 'Accessibility profile updated successfully',
  })
  async updateMyProfile(
    @Request() req: any,
    @Body() updateDto: UpdateAccessibilityProfileDto,
  ): Promise<AccessibilityProfile> {
    return this.accessibilityService.updateProfile(req.user.userId, updateDto);
  }

  @Post('profile/reset')
  @ApiOperation({ summary: 'Reset accessibility profile to defaults' })
  @ApiResponse({
    status: 200,
    description: 'Accessibility profile reset successfully',
  })
  async resetProfile(@Request() req: any): Promise<AccessibilityProfile> {
    return this.accessibilityService.resetProfile(req.user.userId);
  }

  @Get('suggestions/:condition')
  @ApiOperation({ summary: 'Get suggested accessibility settings for a condition' })
  @ApiResponse({
    status: 200,
    description: 'Suggested settings retrieved successfully',
  })
  async getSuggestions(
    @Param('condition') condition: string,
  ): Promise<Partial<AccessibilityProfile>> {
    return this.accessibilityService.getSuggestedSettings(condition);
  }
}
