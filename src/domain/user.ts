import { Day } from "./day";
import { Weather } from "./weather";

export interface User {
    id: number;
    music_choice: {
        [day in Day]?: {
            [weather in Weather]?: number | null;
        };
    };
}