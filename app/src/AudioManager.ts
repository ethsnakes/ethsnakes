import { GameVars } from "./GameVars";
import { GameManager } from "./GameManager";

// audiosprite -e "mp3,ogg" -o ../assets/audio/audiosprite *.mp3 -f howler -b 96

export class AudioManager {

    public static howl: Howl;

    private static lastSoundPlayed: string;
    private static rate: number;
    private static loopID: number; 
    private static timeLastEffectPlayed: number;

    public static init(): void {

        AudioManager.howl.mute(GameVars.gameData.muted);
        AudioManager.rate = 1;
        AudioManager.lastSoundPlayed = null;
        AudioManager.loopID = null;
    }

    public static toggleAudioState(): void {

        GameVars.gameData.muted = !GameVars.gameData.muted;
        GameManager.writeGameData();
        
        AudioManager.howl.mute(GameVars.gameData.muted);
    }

    public static mute(): void {

        AudioManager.howl.mute(true);
    }

    public static unmute(): void {

        if (!GameVars.gameData.muted) {
            AudioManager.howl.mute(false);
        }
    }

    public static playSound(key: string, loop?: boolean, volume?: number): number {

        const t = new Date().getTime();

        if (t - AudioManager.timeLastEffectPlayed < 100 && AudioManager.lastSoundPlayed === key) {
            return;
        }

        AudioManager.timeLastEffectPlayed = t;
        AudioManager.lastSoundPlayed = key;

        loop = loop || false;
        volume = volume || 1;

        const id = AudioManager.howl.play(key);
        
        AudioManager.howl.volume(volume, id);
          
        if (loop) {

            if (AudioManager.loopID) {
                AudioManager.howl.stop(AudioManager.loopID);
            }

            AudioManager.loopID = id;
            AudioManager.rate = 1;
            AudioManager.howl.loop(true, AudioManager.loopID);
        }

        return id;
    }

    public static stopSound(id: number): void {

        AudioManager.howl.stop(id);
    }

    public static setLoopVolume(v: number): void {
        
        AudioManager.howl.volume(v);
    }

    public static stopLoop(loopID?: number): void {

        let id = AudioManager.loopID || loopID;

        if (id) {
            AudioManager.howl.stop(id);
        }
    }

    public static increaseLoopRate(): void {

        if (AudioManager.rate >= 1.75) {
            return;
        }

        AudioManager.rate += .01;

        AudioManager.howl.rate(AudioManager.rate, AudioManager.loopID);
    }

    public static onBlur(): void {
        
        if (!GameVars.gameData.muted && AudioManager.howl) {
            AudioManager.howl.mute(true);
        }
    }

    public static onFocus(): void {
        
        if (!GameVars.gameData.muted && AudioManager.howl) {
            AudioManager.howl.mute(false);
        }
    }
}
