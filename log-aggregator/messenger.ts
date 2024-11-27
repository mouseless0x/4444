import { Telegraf } from "telegraf";

export class Messenger {
	private channelId: string;
	private tg: Telegraf;

	constructor() {
		if (!process.env.BOT_TOKEN) {
			console.log("Need BOT_TOKEN");
			process.exit(1);
		}

		if (!process.env.CHANNEL_ID) {
			console.log("Need CHANNEL_ID");
			process.exit(1);
		}

		const tg = new Telegraf(process.env.BOT_TOKEN);
		tg.launch();

		this.channelId = process.env.CHANNEL_ID;
		this.tg = tg;
	}

	public async sendMessage(message: string) {
		try {
			await this.tg.telegram.sendMessage(this.channelId, message);
		} catch (e) {
			console.log(e);
			await this.tg.telegram.sendMessage(
				this.channelId,
				`FAILED TO FORWARD MESSGAE DUE TO: ${e}`,
			);
		}
	}

	public async shutdown() {
		this.tg.stop();
	}
}
