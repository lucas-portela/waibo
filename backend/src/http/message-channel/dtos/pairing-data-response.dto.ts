import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PairingType } from 'src/application/chat/dtos/pairing-data.dto';

/*
export const PairingDataDto = z.object({
  channelId: z.string().nonempty().nonoptional(),
  type: z.enum(PairingType),
  data: z.string().nonempty().nonoptional(),
});
*/
export class PairingDataResponseDto {
  /**
   * The unique identifier of the channel.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'The unique identifier of the channel.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  channelId: string;

  /**
   * The type of pairing.
   * @example "PRIVATE"
   */
  @ApiProperty({
    description:
      'The type of pairing (Eg.: QR CCode or Raw, like a digit verification).',
    enum: PairingType,
    example: PairingType.QR_CODE,
  })
  @IsEnum(PairingType)
  type: PairingType;

  /**
   * The pairing data as a string.
   * @example "some pairing data"
   */
  @ApiProperty({
    description: 'The pairing data to display to the user',
    example: 'SnVzdCBhbiBleGFtcGxlIG9mIHBhaXJpbmcgZGF0YQ==',
  })
  @IsString()
  @IsNotEmpty()
  data: string;
}
