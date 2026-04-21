import prisma from '../../config/database';
import { ChatMessageDto } from './ai.dto';

const SYSTEM_PROMPT = `Tu es un assistant spirituel chrétien ancré dans la Bible. 
Tu réponds toujours avec humilité, bienveillance, et sur la base des Écritures.
Tu ne remplaces jamais un pasteur, un frère ou une sœur humain.
Pour les crises médicales ou psychologiques graves, tu orientes vers des professionnels.
Tu n'as pas d'opinion personnelle sur les sujets qui divisent les Églises (dons de l'Esprit, baptême, eschatologie).
Tu réponds en français sauf si l'utilisateur écrit dans une autre langue.`;

export class AIService {
  static async chat(userId: string, data: ChatMessageDto) {
    // Fetch or create conversation
    let conversation;
    if (data.conversationId) {
      conversation = await prisma.aIConversation.findUnique({ where: { id: data.conversationId } });
    }
    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: { userId, title: data.message.substring(0, 60) },
      });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: { conversationId: conversation.id, role: 'USER', content: data.message },
    });

    // NOTE: Integrate with OpenAI GPT-4o here
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const response = await openai.chat.completions.create({...});
    const aiResponse = `[Module IA — À connecter à l'API OpenAI GPT-4o] Vous avez posé : "${data.message}"`;

    // Save AI response
    const aiMessage = await prisma.aIMessage.create({
      data: { conversationId: conversation.id, role: 'ASSISTANT', content: aiResponse },
    });

    return { conversationId: conversation.id, response: aiResponse, messageId: aiMessage.id };
  }

  static async getConversations(userId: string) {
    return prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });
  }

  static async getConversationMessages(conversationId: string) {
    return prisma.aIMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async deleteConversation(id: string, userId: string) {
    return prisma.aIConversation.delete({ where: { id, userId } });
  }
}
