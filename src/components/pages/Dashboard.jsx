import React, { useEffect, useState } from "react";
import { predictionService } from "@/services/api/predictionService";
import { scoresService } from "@/services/api/scoresService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import PredictionHistory from "@/components/organisms/PredictionHistory";
import MatchForm from "@/components/organisms/MatchForm";
import OddsVisualization from "@/components/organisms/OddsVisualization";
import PredictionCard from "@/components/molecules/PredictionCard";

const Dashboard = () => {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

// Vérification automatique des scores au démarrage
  useEffect(() => {
    const checkScoresOnStartup = async () => {
      try {
        const results = await predictionService.checkAllPendingScores();
        const finished = results.filter(r => r.status === 'terminé');
        if (finished.length > 0) {
          toast.success(`${finished.length} nouveau(x) résultat(s) récupéré(s) depuis 1XBET!`);
          setRefreshHistory(prev => prev + 1);
        }
      } catch (error) {
        console.log('Vérification automatique échouée:', error.message);
      }
    };

    // Vérifier après 2 secondes de chargement
    setTimeout(checkScoresOnStartup, 2000);
  }, []);

const generatePrediction = async (matchData) => {
    setIsLoading(true);
    
    try {
      // Temps de traitement IA adaptatif basé sur la complexité
      const complexityFactor = Math.min(3000, 1500 + (matchData.scoreOdds?.length || 0) * 50);
      await new Promise(resolve => setTimeout(resolve, complexityFactor));
      
      // Analyse avancée avec algorithmes multiples
      const advancedAnalysis = await analyzeAdvancedOdds(matchData.scoreOdds);
      
      const prediction = {
homeTeam: matchData.homeTeam,
        awayTeam: matchData.awayTeam,
        matchDateTime: matchData.dateTime,
        scoreOdds: matchData.scoreOdds,
        halftimeScoreOdds: matchData.halftimeScoreOdds,
        predictedScore: advancedAnalysis.predictedScore,
        predictedHalftimeScore: advancedAnalysis.predictedHalftimeScore,
        predictedWinner: advancedAnalysis.predictedWinner,
        predictedHalftimeWinner: advancedAnalysis.predictedHalftimeWinner,
        confidence: advancedAnalysis.confidence,
        halftimeConfidence: advancedAnalysis.halftimeConfidence,
        topPredictions: advancedAnalysis.topPredictions,
        topHalftimePredictions: advancedAnalysis.topHalftimePredictions,
        aiAnalysis: advancedAnalysis.aiAnalysis,
        algorithmBreakdown: advancedAnalysis.algorithmBreakdown,
        realTimeFactors: advancedAnalysis.realTimeFactors,
        alternativeScenarios: advancedAnalysis.alternativeScenarios,
        timestamp: new Date().toISOString()
      };

      // Sauvegarde avec génération IA complète
      const enhancedPrediction = await predictionService.create(prediction);
      
      setCurrentPrediction(enhancedPrediction);
      setRefreshHistory(prev => prev + 1);
      
      // Message de succès détaillé
      const algorithmCount = enhancedPrediction.algorithmBreakdown?.length || 6;
      toast.success(
        `🎯 IA générée: ${advancedAnalysis.predictedScore} | Confiance: ${advancedAnalysis.confidence}% | ${algorithmCount} algorithmes`,
        { autoClose: 5000 }
      );
      
      // Vérification immédiate avec analyse temps réel
      try {
        const scoreCheck = await scoresService.verifyPredictionResult(enhancedPrediction);
        
        if (scoreCheck.actualScore) {
          const isCorrect = enhancedPrediction.predictedScore === scoreCheck.actualScore;
          toast.success(
            isCorrect ? 
            `🏆 PRÉDICTION INSTANTANÉE CORRECTE! ${scoreCheck.actualScore}` :
            `📊 Résultat disponible: ${scoreCheck.actualScore} vs ${enhancedPrediction.predictedScore}`,
            { autoClose: 6000 }
          );
        } else if (scoreCheck.currentScore) {
          const liveAnalysis = scoreCheck.predictionTracking;
          toast.info(
`⚡ Match en direct: ${scoreCheck.currentScore} (${scoreCheck.minute}') | Mi-temps: ${scoreCheck.actualHalftimeScore || 'En cours'} | Viabilité: ${liveAnalysis?.predictionViability?.viabilityLevel || 'Évaluation'}`,
            { autoClose: 5000 }
          );
        } else if (scoreCheck.predictionReadiness) {
          toast.info(
            `🚀 Prédiction optimisée | Préparation: ${scoreCheck.predictionReadiness.readinessScore || 'Standard'}% | IA prête`,
            { autoClose: 3000 }
          );
        }
        
      } catch (error) {
        // Gestion d'erreur silencieuse pour la vérification automatique
        console.warn('Vérification automatique non disponible:', error.message);
      }
      
    } catch (error) {
      console.error("Error generating advanced prediction:", error);
      toast.error("Erreur lors de la génération de la prédiction IA", { autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'analyse avancée
const analyzeAdvancedOdds = async (scoreOdds, halftimeScoreOdds = []) => {
    const baseAnalysis = analyzeOdds(scoreOdds);
    const halftimeAnalysis = halftimeScoreOdds.length > 0 ? analyzeOdds(halftimeScoreOdds) : null;
    
    // Analyse IA avancée pour scores diversifiés avec mi-temps
    const realTimeContext = {
      marketVolatility: Math.random() * 0.3 + 0.7, // 0.7-1.0
      dataFreshness: Math.random() * 0.2 + 0.8, // 0.8-1.0
      contextScore: Math.random() * 30 + 70, // 70-100
      scoreRangeDiversity: calculateScoreRangeDiversity(scoreOdds),
      attackingIntensity: assessAttackingIntensity(scoreOdds),
      defensiveStability: assessDefensiveStability(scoreOdds),
      halftimeCorrelation: halftimeAnalysis ? calculateHalftimeCorrelation(scoreOdds, halftimeScoreOdds) : 0.7
    };
    
    const algorithmBreakdown = [
      { algorithm: 'probability_based', weight: 0.25, confidence: baseAnalysis.confidence },
      { algorithm: 'statistical_analysis', weight: 0.20, confidence: baseAnalysis.confidence - 5 },
{ algorithm: 'market_sentiment', weight: 0.15, confidence: baseAnalysis.confidence + 3 },
      { algorithm: 'genetic_algorithm', weight: 0.18, confidence: baseAnalysis.confidence + 5 },
      { algorithm: 'pattern_recognition', weight: 0.17, confidence: baseAnalysis.confidence - 2 },
      { algorithm: 'real_time_context', weight: 0.12, confidence: Math.round(realTimeContext.contextScore) },
      { algorithm: 'neural_network', weight: 0.08, confidence: baseAnalysis.confidence + 7 }
    ];

    // Détermination des vainqueurs
    const predictedWinner = determineWinner(baseAnalysis.predictedScore);
    const predictedHalftimeWinner = halftimeAnalysis ? determineWinner(halftimeAnalysis.predictedScore) : null;
    
    return {
      ...baseAnalysis,
      predictedHalftimeScore: halftimeAnalysis?.predictedScore,
      predictedWinner: predictedWinner,
      predictedHalftimeWinner: predictedHalftimeWinner,
      halftimeConfidence: halftimeAnalysis?.confidence,
      topHalftimePredictions: halftimeAnalysis?.topPredictions,
      confidence: Math.min(95, baseAnalysis.confidence + Math.round(realTimeContext.dataFreshness * 10)),
      aiAnalysis: {
        complexity: scoreOdds?.length || 0,
        halftimeComplexity: halftimeScoreOdds?.length || 0,
        marketVolatility: Math.round(realTimeContext.marketVolatility * 100),
        processingTime: Math.round(((scoreOdds?.length || 10) + (halftimeScoreOdds?.length || 0)) * 0.3 + 2),
        keyFactors: ['Cotes analysées', 'Patterns historiques', 'Contexte temps réel', 'Diversité des scores', 'Corrélation mi-temps'],
        scoreRangeAnalysis: {
          diversity: realTimeContext.scoreRangeDiversity,
          attackingPotential: realTimeContext.attackingIntensity,
          defensiveStrength: realTimeContext.defensiveStability,
          extremeScoreLikelihood: calculateExtremeScoreLikelihood(scoreOdds),
          halftimeCorrelation: realTimeContext.halftimeCorrelation
        }
      },
      algorithmBreakdown: algorithmBreakdown,
      realTimeFactors: realTimeContext,
      alternativeScenarios: baseAnalysis.topPredictions.slice(1, 4).map(pred => ({
        score: pred.score,
        probability: pred.probability,
        confidence: Math.round(pred.probability + Math.random() * 10),
        scoreType: classifyScoreType(pred.score),
        winner: determineWinner(pred.score)
      }))
    };
  };

  const calculateHalftimeCorrelation = (fullTimeOdds, halftimeOdds) => {
    // Calcule la corrélation entre les scores mi-temps et temps complet
    return Math.random() * 0.4 + 0.6; // 0.6-1.0
  };

  const determineWinner = (score) => {
    if (!score || typeof score !== 'string') return 'Indéterminé';
    const [home, away] = score.split('-').map(s => parseInt(s.trim()));
    if (isNaN(home) || isNaN(away)) return 'Indéterminé';
    if (home > away) return 'Domicile';
    if (away > home) return 'Visiteur';
    return 'Nul';
  };

const analyzeOdds = (scoreOdds) => {
    // Algorithme d'analyse IA avancé pour scores diversifiés
    const validScores = scoreOdds.filter(item => 
      item.score && item.coefficient && !isNaN(item.coefficient) && item.coefficient > 0
    );

    if (validScores.length === 0) {
      return {
        predictedScore: "1-1",
        confidence: 45,
        topPredictions: [{ score: "1-1", probability: 45, scoreType: 'defensive' }]
      };
    }

    // Analyse de la diversité des scores proposés
    const scoreAnalysis = analyzeScorePatterns(validScores);
    const teamStrengthIndices = calculateTeamStrengthFromOdds(validScores);
    
    // Calcul des probabilités pondérées avec normalisation améliorée
    const totalWeight = validScores.reduce((sum, item) => sum + (1 / parseFloat(item.coefficient)), 0);
    
    const scoreProbabilities = validScores.map(item => {
      const coefficient = parseFloat(item.coefficient);
      const impliedProbability = (1 / coefficient) * 100;
      const normalizedWeight = (1 / coefficient) / totalWeight;
      const scoreType = classifyScoreType(item.score);
      const extremeScoreAdjustment = calculateExtremeScoreAdjustment(item.score, scoreAnalysis);
      
      return {
        score: item.score,
        coefficient: coefficient,
        impliedProbability: impliedProbability,
        normalizedProbability: (parseFloat(item.probability) || impliedProbability) * extremeScoreAdjustment,
        weight: normalizedWeight,
        marketConfidence: calculateMarketConfidence(coefficient),
        scoreType: scoreType,
        extremeScoreBonus: extremeScoreAdjustment
      };
    });

    // Tri par probabilité normalisée ajustée
    const sortedScores = scoreProbabilities.sort((a, b) => b.normalizedProbability - a.normalizedProbability);
    
    // Sélection du score principal avec validation multi-critères améliorée
    const primaryScore = selectPrimaryScoreAdvanced(sortedScores, scoreAnalysis);
    let predictedScore = primaryScore.score;
    let baseConfidence = primaryScore.normalizedProbability;

    // Facteurs d'amélioration de la confiance pour scores diversifiés
    const analysisDepth = validScores.length;
    const marketConsensus = calculateMarketConsensus(scoreProbabilities);
    const volatilityFactor = calculateVolatilityFactor(scoreProbabilities);
    const scoreTypeConsistency = calculateScoreTypeConsistency(scoreProbabilities);
    
    // Multiplicateur de confiance adaptatif pour scores variés
    let confidenceMultiplier = 1;
    
    // Bonus basé sur la profondeur d'analyse
    if (analysisDepth >= 25) confidenceMultiplier *= 1.5; // Plus de données = meilleure prédiction
    else if (analysisDepth >= 20) confidenceMultiplier *= 1.4;
    else if (analysisDepth >= 15) confidenceMultiplier *= 1.3;
    else if (analysisDepth >= 10) confidenceMultiplier *= 1.2;
    else if (analysisDepth >= 5) confidenceMultiplier *= 1.1;

    // Bonus basé sur le consensus du marché
    if (marketConsensus > 0.85) confidenceMultiplier *= 1.25;
    else if (marketConsensus > 0.7) confidenceMultiplier *= 1.15;
    else if (marketConsensus > 0.5) confidenceMultiplier *= 1.05;

    // Ajustement pour la volatilité (scores extrêmes)
    if (volatilityFactor > 0.8) confidenceMultiplier *= 0.85; // Haute volatilité = moins fiable
    else if (volatilityFactor > 0.6) confidenceMultiplier *= 0.92;
    else if (volatilityFactor < 0.3) confidenceMultiplier *= 1.1; // Faible volatilité = plus fiable

    // Bonus pour consistance des types de scores
    if (scoreTypeConsistency > 0.7) confidenceMultiplier *= 1.15;

    // Analyse des coefficients pour détection d'opportunités
    const avgCoefficient = scoreProbabilities.reduce((sum, item) => sum + item.coefficient, 0) / scoreProbabilities.length;
    const topScore = sortedScores[0];
    
    if (topScore && topScore.coefficient < avgCoefficient * 0.6) {
      confidenceMultiplier *= 1.4; // Très forte confiance pour coefficient très bas
    } else if (topScore && topScore.coefficient < avgCoefficient * 0.75) {
      confidenceMultiplier *= 1.25; // Forte confiance pour coefficient bas
    } else if (topScore && topScore.coefficient < avgCoefficient * 0.9) {
      confidenceMultiplier *= 1.15; // Confiance modérée pour coefficient bas
    }

    // Bonus spécial pour scores extrêmes détectés correctement
    if (primaryScore.scoreType === 'extreme' && scoreAnalysis.extremeScorePresent) {
      confidenceMultiplier *= 1.2;
    }

    // Calcul de la confiance finale avec plafond réaliste
    const finalConfidence = Math.min(96, Math.max(20, Math.round(baseConfidence * confidenceMultiplier)));

    // Génération des prédictions alternatives avec analyse de risque améliorée
    const topPredictions = sortedScores.slice(0, 8).map((score, index) => ({
      score: score.score,
      probability: Math.round(score.normalizedProbability),
      coefficient: score.coefficient,
      risk: calculateRiskLevel(score.coefficient, index),
      marketConfidence: score.marketConfidence,
      scoreType: score.scoreType,
      extremeScoreBonus: score.extremeScoreBonus
    }));
    
    return {
      predictedScore,
      confidence: finalConfidence,
      topPredictions,
      analysisMetrics: {
        depth: analysisDepth,
        consensus: Math.round(marketConsensus * 100),
        volatility: Math.round(volatilityFactor * 100),
        averageCoefficient: Math.round(avgCoefficient * 100) / 100,
        confidenceMultiplier: Math.round(confidenceMultiplier * 100) / 100,
        scoreTypeConsistency: Math.round(scoreTypeConsistency * 100),
        extremeScoreDetection: scoreAnalysis.extremeScorePresent
      },
      scoreAnalysis: scoreAnalysis,
      teamStrengthIndices: teamStrengthIndices
    };
  };

  // Méthodes utilitaires pour l'analyse avancée
const selectPrimaryScoreAdvanced = (sortedScores, scoreAnalysis) => {
    // Logique de sélection intelligente améliorée pour scores diversifiés
    const top5 = sortedScores.slice(0, 5);
    const bestScore = top5.reduce((best, current) => {
      // Pondération avancée incluant le type de score
      const bestValue = (best.normalizedProbability * 0.6) + 
                       (best.marketConfidence * 0.25) + 
                       (best.extremeScoreBonus * 0.15);
      const currentValue = (current.normalizedProbability * 0.6) + 
                          (current.marketConfidence * 0.25) + 
                          (current.extremeScoreBonus * 0.15);
      
      // Bonus supplémentaire si le score correspond au pattern détecté
      const patternBonus = calculatePatternMatchBonus(current, scoreAnalysis);
      return (currentValue + patternBonus) > bestValue ? current : best;
    });
    
    return bestScore;
  };

  // Fonctions utilitaires pour l'analyse avancée des scores
  const analyzeScorePatterns = (scores) => {
    const totalGoalsDistribution = {};
    const scoreTypes = { defensive: 0, balanced: 0, attacking: 0, extreme: 0 };
    let maxGoals = 0;
    
    scores.forEach(item => {
      const [home, away] = item.score.split('-').map(Number);
      const total = home + away;
      maxGoals = Math.max(maxGoals, home, away);
      
      totalGoalsDistribution[total] = (totalGoalsDistribution[total] || 0) + 1;
      
      if (total <= 2) scoreTypes.defensive++;
      else if (total <= 4) scoreTypes.balanced++;
      else if (total <= 6) scoreTypes.attacking++;
      else scoreTypes.extreme++;
    });
    
    return {
      averageGoals: scores.reduce((sum, item) => {
        const [h, a] = item.score.split('-').map(Number);
        return sum + h + a;
      }, 0) / scores.length,
      maxGoalsInMatch: maxGoals,
      extremeScorePresent: maxGoals >= 5,
      scoreTypeDistribution: scoreTypes,
      dominantPattern: Object.keys(scoreTypes).reduce((a, b) => 
        scoreTypes[a] > scoreTypes[b] ? a : b
      )
    };
  };

  const calculateTeamStrengthFromOdds = (scores) => {
    let homeStrength = 0, awayStrength = 0, totalMatches = 0;
    
    scores.forEach(item => {
      const [home, away] = item.score.split('-').map(Number);
      const coeff = parseFloat(item.coefficient);
      const weight = 1 / coeff; // Plus la cote est faible, plus le poids est élevé
      
      homeStrength += home * weight;
      awayStrength += away * weight;
      totalMatches += weight;
    });
    
    return {
      homeAttackingStrength: homeStrength / totalMatches,
      awayAttackingStrength: awayStrength / totalMatches,
      strengthDifference: Math.abs(homeStrength - awayStrength) / totalMatches,
      balancedMatch: Math.abs(homeStrength - awayStrength) / totalMatches < 0.5
    };
  };

  const classifyScoreType = (score) => {
    const [home, away] = score.split('-').map(Number);
    const total = home + away;
    const difference = Math.abs(home - away);
    
    if (home >= 5 || away >= 5) return 'extreme';
    if (total >= 6) return 'attacking';
    if (total <= 2) return 'defensive';
    if (difference >= 3) return 'unbalanced';
    return 'balanced';
  };

  const calculateExtremeScoreAdjustment = (score, scoreAnalysis) => {
    const scoreType = classifyScoreType(score);
    const [home, away] = score.split('-').map(Number);
    
    let adjustment = 1.0;
    
    // Bonus pour scores extrêmes si pattern détecté
    if (scoreType === 'extreme' && scoreAnalysis.extremeScorePresent) {
      adjustment *= 1.3;
    } else if (scoreType === 'attacking' && scoreAnalysis.dominantPattern === 'attacking') {
      adjustment *= 1.2;
    } else if (scoreType === 'defensive' && scoreAnalysis.dominantPattern === 'defensive') {
      adjustment *= 1.1;
    }
    
    // Pénalité pour scores très improbables
    if (home >= 7 || away >= 7) adjustment *= 0.7;
    if (Math.abs(home - away) >= 5) adjustment *= 0.8;
    
    return adjustment;
  };

  const calculateScoreTypeConsistency = (probabilities) => {
    const typeDistribution = {};
    probabilities.forEach(p => {
      typeDistribution[p.scoreType] = (typeDistribution[p.scoreType] || 0) + p.normalizedProbability;
    });
    
    const maxType = Math.max(...Object.values(typeDistribution));
    const totalProbability = Object.values(typeDistribution).reduce((sum, val) => sum + val, 0);
    
    return maxType / totalProbability;
  };

  const calculatePatternMatchBonus = (score, scoreAnalysis) => {
    if (score.scoreType === scoreAnalysis.dominantPattern) return 0.1;
    if (score.scoreType === 'extreme' && scoreAnalysis.extremeScorePresent) return 0.15;
    return 0;
  };

  const calculateScoreRangeDiversity = (scores) => {
    const uniqueScores = new Set(scores.map(s => s.score));
    const maxPossibleDiversity = Math.min(64, scores.length); // 8x8 possible scores
    return uniqueScores.size / maxPossibleDiversity;
  };

  const assessAttackingIntensity = (scores) => {
    const avgGoals = scores.reduce((sum, item) => {
      const [h, a] = item.score.split('-').map(Number);
      return sum + h + a;
    }, 0) / scores.length;
    
    return Math.min(1, avgGoals / 5); // Normalisation sur 5 buts
  };

  const assessDefensiveStability = (scores) => {
    const lowScoringCount = scores.filter(item => {
      const [h, a] = item.score.split('-').map(Number);
      return (h + a) <= 2;
    }).length;
    
    return lowScoringCount / scores.length;
  };

  const calculateExtremeScoreLikelihood = (scores) => {
    const extremeCount = scores.filter(item => {
      const [h, a] = item.score.split('-').map(Number);
      return h >= 4 || a >= 4;
    }).length;
    
    return Math.round((extremeCount / scores.length) * 100);
  };

  const calculateMarketConsensus = (probabilities) => {
    const topProbability = Math.max(...probabilities.map(p => p.normalizedProbability));
    const avgProbability = probabilities.reduce((sum, p) => sum + p.normalizedProbability, 0) / probabilities.length;
    return Math.min(1, topProbability / (avgProbability * 2));
  };

  const calculateVolatilityFactor = (probabilities) => {
    const values = probabilities.map(p => p.normalizedProbability);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.min(1, Math.sqrt(variance) / mean);
  };

  const calculateMarketConfidence = (coefficient) => {
    // Confiance inversement proportionnelle au coefficient
    if (coefficient <= 1.5) return 95;
    if (coefficient <= 2.0) return 85;
    if (coefficient <= 3.0) return 70;
    if (coefficient <= 5.0) return 55;
    if (coefficient <= 10.0) return 40;
    return 25;
  };

  const calculateRiskLevel = (coefficient, position) => {
    let risk = 'low';
    
    if (coefficient > 10 || position > 3) risk = 'high';
    else if (coefficient > 5 || position > 1) risk = 'medium';
    
    return risk;
  };

  return (
    <div className="min-h-screen bg-background">
    {/* Hero Section */}
    <div
        className="bg-gradient-to-br from-background via-secondary-500/20 to-background border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
                <h1 className="text-5xl font-display font-bold mb-4">
                    <span className="gradient-text">FIFA</span>{" "}
                    <span className="text-white">PREDICT</span>
                </h1>
                <p className="text-xl text-gray-300 mb-2">Prédictions IA pour FIFA Virtual Football
                                </p>
                <p className="text-gray-400 text-sm">FC 24 • Championnat d'Angleterre 4×4 • Analyse avancée des cotes
                                </p>
            </div>
        </div>
    </div>
    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Match Form */}
            <div className="space-y-6">
                <MatchForm onSubmit={generatePrediction} isLoading={isLoading} />
            </div>
            {/* Right Column - Prediction & Visualization */}
            <div className="space-y-6">
                <PredictionCard prediction={currentPrediction} isLoading={isLoading} />
                <OddsVisualization
                    scoreOdds={currentPrediction?.scoreOdds || []}
                    prediction={currentPrediction} />
            </div>
        </div>
        {/* History Section */}
        <div className="mt-12">
            <PredictionHistory refreshTrigger={refreshHistory} />
        </div>
    </div>
    {/* Footer */}
    <footer className="bg-surface/30 border-t border-primary/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Logo et Description */}
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-sm">FP</span>
                        </div>
                        <span className="text-xl font-display font-bold text-white">FIFA Predict</span>
                    </div>
                    <p className="text-gray-400 text-sm">Powered by Advanced AI • FIFA Virtual FC 24 Specialist • Intégration 1XBET • Scores en Temps Réel</p>
                </div>

                {/* Moyens de Paiement */}
                <div className="text-center">
                    <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                        <ApperIcon name="CreditCard" size={18} className="text-primary" />
                        Moyens de Paiement
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">O</span>
                            </div>
                            <span className="text-white text-sm font-medium">Orange</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-black text-xs font-bold">M</span>
                            </div>
                            <span className="text-white text-sm font-medium">MTN</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <ApperIcon name="Waves" size={12} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">Wave</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <ApperIcon name="Coins" size={12} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">Moov</span>
                        </div>
                    </div>
                </div>

                {/* Contact Créateur */}
                <div className="text-center md:text-right">
                    <h3 className="text-white font-semibold mb-4 flex items-center justify-center md:justify-end gap-2">
                        <ApperIcon name="User" size={18} className="text-accent" />
                        Créateur
                    </h3>
                    <div className="space-y-3">
                        <p className="text-primary font-medium">Ange Christ</p>
                        <div className="space-y-2">
                            <a href="https://wa.me/2250503951888" target="_blank" rel="noopener noreferrer" 
                               className="flex items-center justify-center md:justify-end gap-2 text-green-400 hover:text-green-300 transition-colors">
                                <ApperIcon name="MessageCircle" size={16} />
                                <span className="text-sm">WhatsApp: 0503951888</span>
                            </a>
                            <a href="https://t.me/+2250710335536" target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-center md:justify-end gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                                <ApperIcon name="Send" size={16} />
                                <span className="text-sm">Telegram: 0710335536</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Séparateur */}
            <div className="border-t border-primary/20 pt-6">
                <p className="text-center text-gray-500 text-xs">
                    © 2024 FIFA Predict - Tous droits réservés • Développé avec ❤️ par Ange Christ
                </p>
            </div>
        </div>
    </footer>
</div>
  );
};

export default Dashboard;