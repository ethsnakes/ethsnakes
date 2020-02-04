import { GameVars } from "../../../GameVars";

export class BalanceContainer extends Phaser.GameObjects.Container {

    private balanceLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.x = 200 * GameVars.scaleX;
        this.y = 40;

        this.scaleX = GameVars.scaleX;

        const balanceContainerBackground = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "balance");
        this.add(balanceContainerBackground);

        const yourBalanceLabel = new Phaser.GameObjects.Text(this.scene, -100, -15, "BALANCE:", {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "28px", color: "#7A431C"});
        yourBalanceLabel.scaleX = GameVars.scaleX;
        this.add(yourBalanceLabel);

        this.balanceLabel = new Phaser.GameObjects.Text(this.scene, 42 * GameVars.scaleX, -15, "", {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "28px", color: "#7A431C"});
        this.balanceLabel.scaleX = GameVars.scaleX;
        this.add(this.balanceLabel);
    }

    public onBalanceAvailable(): void {

        this.balanceLabel.text = GameVars.balance.toString() + " ETH";
    }

    public onTransactionExecuted(): void {

        this.balanceLabel.text = GameVars.balance.toString() + " ETH";
    }

    public onPlayerVictory(): void {

        let balanceBeforeWinning = GameVars.balance - 2 * GameVars.bet;
        balanceBeforeWinning = Math.floor(balanceBeforeWinning * 100) / 100;

        this.balanceLabel.text = balanceBeforeWinning.toString() + " ETH";

        this.scene.time.delayedCall(3000, function(): void {

            const newBalanceLabel = new Phaser.GameObjects.Text(this.scene, 42 * GameVars.scaleX, -15 + 30, GameVars.balance.toString() + " ETH", {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "28px", color: "#7A431C"});
            newBalanceLabel.scaleX = GameVars.scaleX;
            newBalanceLabel.alpha = 0;
            this.add(newBalanceLabel);

            this.scene.tweens.add({
                targets: this.balanceLabel,
                alpha: 0,
                y: -15 - 30,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 300,
                onComplete: function(): void {
                    this.balanceLabel.destroy();
                },
                onCompleteScope: this
            });

            this.scene.tweens.add({
                targets: newBalanceLabel,
                alpha: 1,
                y: -15,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 300
            });

        }, [], this);

    }
}
