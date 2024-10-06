import { Injectable } from '@angular/core';

export interface IResponsiveGenerateSrc {
    /**
     * return an url for the real src, the width or height may be 0 that means it will be automatic to keep ratio.
     * @param src
     * @param width
     * @param height
     * @param originalWidth
     * @param originalHeight
     * @param ratio the client height/width ratio, can be 0 means the width or height is 0
     */
    makeRespSrc(src: string, width: number, height: number, originalWidth: number, originalHeight: number, ratio: number): string;
}

@Injectable()
export class ResponsiveGenerateSrcService implements IResponsiveGenerateSrc {
    makeRespSrc(src: string, width: number, height: number, originalWidth: number, originalHeight: number, ratio: number): string {
        return `${src}?size=${width}x${height}`;
    }
}

@Injectable()
export class RoundGenerateSrcService implements IResponsiveGenerateSrc {
    makeRespSrc(src: string, width: number, height: number, originalWidth: number, originalHeight: number, ratio: number): string {
        if (width !== 0) {
            width = Math.round(width / 20) * 20;
            if (height !== 0) {
                height = width * ratio;
            }
        } else if (height !== 0) {
            height = Math.round(height / 20) * 20;
            if (width !== 0) {
                width = height / ratio;
            }
        }
        return `${src}?size=${width}x${height}`;
    }
}
