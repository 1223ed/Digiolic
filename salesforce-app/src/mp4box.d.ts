declare module 'mp4box' {
  export interface MP4File {
    onReady?: (info: MP4Info) => void;
    onError?: (e: string | Error) => void;
    onSamples?: (id: number, user: any, samples: MP4Sample[]) => void;
    appendBuffer(data: ArrayBuffer): number;
    flush(): void;
    setExtractionOptions(id: number, user?: any, options?: { nbSamples?: number }): void;
    start(): void;
    stop(): void;
  }

  export interface MP4Track {
    id: number;
    codec: string;
    nb_samples: number;
    duration: number;
    timescale: number;
    mdia?: any;
    video?: {
      width: number;
      height: number;
    };
  }

  export interface MP4Info {
    tracks: MP4Track[];
    videoTracks: MP4Track[];
    duration: number;
    timescale: number;
  }

  export interface MP4Sample {
    number: number;
    track_id: number;
    timescale: number;
    description: any;
    is_sync: boolean;
    dts: number;
    cts: number;
    duration: number;
    size: number;
    data: Uint8Array;
  }

  export function createFile(): MP4File;
  export class DataStream {
    static BIG_ENDIAN: boolean;
    constructor(arrayBuffer?: ArrayBuffer, byteOffset?: number, endianness?: boolean);
    buffer: ArrayBuffer;
    writeUint8(value: number): void;
    writeUint16(value: number): void;
    writeUint32(value: number): void;
    writeUint8Array(arr: Uint8Array): void;
  }

  const mp4box: {
    createFile: () => MP4File;
    DataStream: typeof DataStream;
  };
  export default mp4box;
}
