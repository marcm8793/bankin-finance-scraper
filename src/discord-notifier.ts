import {
  Client,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder,
} from "discord.js";

export interface FinancialSummary {
  success: boolean;
  currentMonth: string;
  revenues: string;
  expenses: string;
  netBalance: string;
  message?: string;
}

export class DiscordNotifier {
  private client: Client;
  private token: string;
  private channelId: string;

  constructor(token: string, channelId: string) {
    this.token = token;
    this.channelId = channelId;
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
  }

  /**
   * Initialise la connexion Discord
   */
  async initialize(): Promise<void> {
    try {
      await this.client.login(this.token);
      console.log("✅ Connexion Discord établie");
    } catch (error) {
      console.error("❌ Erreur de connexion Discord:", error);
      throw error;
    }
  }

  /**
   * Envoie un résumé financier sur Discord
   */
  async sendFinancialSummary(summary: FinancialSummary): Promise<void> {
    try {
      const channel = (await this.client.channels.fetch(
        this.channelId
      )) as TextChannel;

      if (!channel) {
        throw new Error(
          `Channel Discord avec l'ID ${this.channelId} introuvable`
        );
      }

      const embed = this.createFinancialEmbed(summary);
      await channel.send({ embeds: [embed] });

      console.log("✅ Résumé financier envoyé sur Discord");
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi sur Discord:", error);
      throw error;
    }
  }

  /**
   * Envoie un message d'erreur sur Discord
   */
  async sendErrorMessage(errorMessage: string): Promise<void> {
    try {
      const channel = (await this.client.channels.fetch(
        this.channelId
      )) as TextChannel;

      if (!channel) {
        throw new Error(
          `Channel Discord avec l'ID ${this.channelId} introuvable`
        );
      }

      const embed = new EmbedBuilder()
        .setTitle("❌ Erreur Bankin Scraper")
        .setDescription(errorMessage)
        .setColor(0xff0000)
        .setTimestamp()
        .setFooter({ text: "Bankin Finance Scraper" });

      await channel.send({ embeds: [embed] });

      console.log("✅ Message d'erreur envoyé sur Discord");
    } catch (error) {
      console.error(
        "❌ Erreur lors de l'envoi du message d'erreur sur Discord:",
        error
      );
    }
  }

  /**
   * Crée un embed Discord pour le résumé financier
   */
  private createFinancialEmbed(summary: FinancialSummary): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setTitle("💰 Résumé Financier Bankin")
      .setTimestamp()
      .setFooter({ text: "Bankin Finance Scraper" });

    if (summary.success) {
      // Déterminer la couleur basée sur le solde net
      const netBalanceValue = parseFloat(summary.netBalance.replace(",", "."));
      const color = netBalanceValue >= 0 ? 0x00ff00 : 0xff6b6b; // Vert si positif, rouge si négatif

      embed
        .setColor(color)
        .setDescription(`📅 **Mois:** ${summary.currentMonth}`)
        .addFields(
          {
            name: "💸 Dépenses",
            value: summary.expenses,
            inline: true,
          },
          {
            name: "💰 Revenus",
            value: summary.revenues,
            inline: true,
          },
          {
            name: "📊 Solde Net",
            value: `${summary.netBalance} €`,
            inline: true,
          }
        );

      // Ajouter un indicateur visuel pour le solde
      if (netBalanceValue >= 0) {
        embed.addFields({
          name: "📈 Statut",
          value: "✅ Solde positif",
          inline: false,
        });
      } else {
        embed.addFields({
          name: "📉 Statut",
          value: "⚠️ Solde négatif",
          inline: false,
        });
      }
    } else {
      embed
        .setColor(0xff0000)
        .setDescription("❌ Échec de la récupération des données financières")
        .addFields({
          name: "Erreur",
          value: summary.message || "Erreur inconnue",
          inline: false,
        });
    }

    return embed;
  }

  /**
   * Ferme la connexion Discord
   */
  async close(): Promise<void> {
    try {
      await this.client.destroy();
      console.log("✅ Connexion Discord fermée");
    } catch (error) {
      console.error("❌ Erreur lors de la fermeture Discord:", error);
    }
  }
}
