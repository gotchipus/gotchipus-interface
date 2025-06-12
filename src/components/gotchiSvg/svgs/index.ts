import { BG_BYTES32, BODY_BYTES32, CLOTHES_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32 } from "@/lib/constant";
import { backgroundSvgs } from "./background";
import { bodySvgs } from "./body";
import { clothesSvgs } from "./clothes";
import { eyeSvgs } from "./eye";
import { handSvgs } from "./hand";
import { headSvgs } from "./head";

export const ALL_WEARABLE_SVG = {
    [BG_BYTES32]: backgroundSvgs,
    [BODY_BYTES32]: bodySvgs,
    [CLOTHES_BYTES32]: clothesSvgs,
    [EYE_BYTES32]: eyeSvgs,
    [HAND_BYTES32]: handSvgs,
    [HEAD_BYTES32]: headSvgs,
};