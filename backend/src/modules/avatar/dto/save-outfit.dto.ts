import { IsString, IsObject, MinLength, MaxLength } from 'class-validator';
import { AvatarComponents } from '../entities/student-avatar.entity';

export class SaveOutfitDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsObject()
  components: AvatarComponents;
}
