import { z } from 'zod';

export enum PairingType {
  QR_CODE = 'QR_CODE',
  RAW = 'RAW',
}

export const PairingDataDto = z.object({
  channelId: z.string().nonempty().nonoptional(),
  type: z.enum(PairingType),
  data: z.string().nonempty().nonoptional(),
});

export type PairingDataDto = z.infer<typeof PairingDataDto>;
