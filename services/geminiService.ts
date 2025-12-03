import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Initialize Gemini
// NOTE: In a real production environment, ensure your API key is secure.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  try {
    const prompt = `Rédige une description commerciale courte, attrayante et professionnelle (max 50 mots) pour un produit nommé "${name}" appartenant à la catégorie "${category}". Le ton doit être vendeur.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Description non disponible.";
  } catch (error) {
    console.error("Erreur Gemini (Description):", error);
    throw new Error("Impossible de générer la description. Vérifiez votre clé API.");
  }
};

export const analyzeStockHealth = async (products: Product[]): Promise<string> => {
  try {
    const stockSummary = products.map(p => 
      `- ${p.name} (Qté: ${p.quantity}, Min: ${p.minStock}, Prix: ${p.price}€)`
    ).join('\n');

    const prompt = `Tu es un expert en logistique et gestion d'inventaire. Analyse la liste de stock suivante et fournis un rapport concis en format Markdown.
    
    Tes objectifs :
    1. Identifier les produits en rupture ou stock critique.
    2. Identifier le sur-stockage potentiel (si quantité > 100).
    3. Suggérer une action prioritaire pour optimiser la valeur du stock.
    
    Données du stock :
    ${stockSummary}
    
    Reste professionnel et direct.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analyse non disponible.";
  } catch (error) {
    console.error("Erreur Gemini (Analyse):", error);
    throw new Error("Impossible d'analyser le stock. Vérifiez votre clé API.");
  }
};
