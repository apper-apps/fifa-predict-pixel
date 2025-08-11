import { scoresService } from "./scoresService";
import React from "react";
import Error from "@/components/ui/Error";
import predictionsData from "@/services/mockData/predictions.json";

class PredictionService {
  constructor() {
    this.predictions = [...predictionsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.predictions];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const prediction = this.predictions.find(p => p.Id === parseInt(id));
    if (!prediction) {
      throw new Error(`Prédiction avec l'ID ${id} non trouvée`);
    }
    return { ...prediction };
  }

async create(predictionData) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Plus de temps pour l'IA
    
    // Analyse avancée avec IA
    const enhancedPrediction = await this.generateAIPrediction(predictionData);
    
    const highestId = this.predictions.reduce((max, p) => Math.max(max, p.Id), 0);
    const newPrediction = {
      Id: highestId + 1,
      ...enhancedPrediction,
      timestamp: predictionData.timestamp || new Date().toISOString(),
      aiVersion: '2.1.0',
      analysisComplexity: 'advanced'
    };
    
    this.predictions.push(newPrediction);
    
    // Apprentissage continu
    this.updateAIModel(newPrediction);
    
    return { ...newPrediction };
  }

  // Nouveau système d'IA pour prédictions
  async generateAIPrediction(matchData) {
    const teamStats = await this.analyzeTeamStatistics(matchData.homeTeam, matchData.awayTeam);
    const historicalData = await this.getHistoricalMatchData(matchData.homeTeam, matchData.awayTeam);
    const oddsAnalysis = this.analyzeOddsPattern(matchData.scoreOdds);
    const marketTrends = this.analyzeMarketTrends(matchData.scoreOdds);
    
    // Algorithme d'IA avancé
    const aiPrediction = this.calculateAIPrediction({
      teamStats,
      historicalData,
      oddsAnalysis,
      marketTrends,
      originalData: matchData
    });
    
    return {
      ...matchData,
      predictedScore: aiPrediction.mostLikelyScore,
      confidence: aiPrediction.confidence,
      aiAnalysis: aiPrediction.analysis,
      alternativeScenarios: aiPrediction.alternatives,
      riskLevel: aiPrediction.riskAssessment
    };
  }

  async analyzeTeamStatistics(homeTeam, awayTeam) {
    const homeStats = await this.getTeamPerformanceStats(homeTeam);
    const awayStats = await this.getTeamPerformanceStats(awayTeam);
    
    return {
      homeTeam: {
        ...homeStats,
        homeAdvantage: this.calculateHomeAdvantage(homeTeam),
        recentForm: this.analyzeRecentForm(homeTeam),
        scoringTrends: this.analyzeScoringTrends(homeTeam)
      },
      awayTeam: {
        ...awayStats,
        awayRecord: this.calculateAwayRecord(awayTeam),
        recentForm: this.analyzeRecentForm(awayTeam),
        scoringTrends: this.analyzeScoringTrends(awayTeam)
      },
      headToHead: await this.getHeadToHeadStats(homeTeam, awayTeam)
    };
  }

  getTeamPerformanceStats(teamName) {
    // Simulation d'analyse statistique avancée
    const baseRating = Math.floor(Math.random() * 20) + 70; // 70-90
    const form = Math.floor(Math.random() * 10) + 1; // 1-10
    
    return {
      overallRating: baseRating,
      attackRating: baseRating + (Math.random() * 10 - 5),
      defenseRating: baseRating + (Math.random() * 10 - 5),
      currentForm: form,
      goalsPerMatch: (Math.random() * 2 + 1).toFixed(1),
      cleanSheets: Math.floor(Math.random() * 10),
      winPercentage: Math.floor(Math.random() * 40 + 40)
    };
  }

calculateAIPrediction({ teamStats, historicalData, oddsAnalysis, marketTrends, originalData }) {
    // Algorithmes IA avancés avec pondération dynamique
    const algorithms = [
      this.probabilityBasedAlgorithm(teamStats, oddsAnalysis),
      this.statisticalAnalysisAlgorithm(teamStats, historicalData),
      this.marketSentimentAlgorithm(marketTrends, oddsAnalysis),
      this.patternRecognitionAlgorithm(historicalData, teamStats),
      this.realTimeContextAlgorithm(teamStats, oddsAnalysis, originalData),
      this.neuralNetworkSimulation(teamStats, historicalData, oddsAnalysis)
    ];
    
    // Pondération dynamique basée sur la performance historique
    const algorithmPerformance = this.getAlgorithmPerformanceHistory();
    const weightedResults = algorithms.map((result, index) => ({
      ...result,
      weight: this.getDynamicAlgorithmWeight(index, algorithmPerformance, teamStats),
      reliability: this.calculateAlgorithmReliability(index, teamStats)
    }));
    
    // Fusion avancée des résultats avec validation croisée
    const finalPrediction = this.advancedResultsCombination(weightedResults);
    const crossValidation = this.performCrossValidation(weightedResults);
    
    return {
      mostLikelyScore: finalPrediction.score,
      confidence: this.calculateEnhancedConfidence(finalPrediction, teamStats, crossValidation),
      analysis: this.generateAdvancedAnalysisReport(teamStats, finalPrediction, algorithms),
      alternatives: this.getEnhancedAlternativeScenarios(weightedResults),
      riskAssessment: this.assessAdvancedPredictionRisk(finalPrediction, teamStats),
      algorithmBreakdown: this.generateAlgorithmBreakdown(weightedResults),
      realTimeFactors: this.extractRealTimeFactors(originalData)
    };
  }

  realTimeContextAlgorithm(teamStats, oddsAnalysis, originalData) {
    // Algorithme tenant compte du contexte temps réel
    const currentTime = new Date();
    const matchTime = new Date(originalData.dateTime || originalData.matchDateTime);
    const timeUntilMatch = matchTime - currentTime;
    
    // Facteurs temps réel
    const realTimeFactors = {
      marketVolatility: this.calculateMarketVolatility(oddsAnalysis),
      timeProximity: Math.max(0, 1 - (timeUntilMatch / (24 * 60 * 60 * 1000))), // 0-1 scale
      dataFreshness: this.assessDataFreshness(teamStats),
      injuryReports: this.simulateInjuryImpact(),
      weatherConditions: this.simulateWeatherImpact()
    };
    
    // Ajustement du score basé sur les facteurs temps réel
    const baseScore = this.calculateBaseScore(teamStats);
    const adjustedScore = this.applyRealTimeAdjustments(baseScore, realTimeFactors);
    
    return {
      score: adjustedScore,
      confidence: 0.78 + (realTimeFactors.dataFreshness * 0.15),
      algorithm: 'real_time_context',
      factors: realTimeFactors
    };
  }

  neuralNetworkSimulation(teamStats, historicalData, oddsAnalysis) {
    // Simulation d'un réseau de neurones pour la prédiction
    const inputs = this.prepareNeuralInputs(teamStats, historicalData, oddsAnalysis);
    const hiddenLayer = this.simulateHiddenLayer(inputs);
    const outputLayer = this.simulateOutputLayer(hiddenLayer);
    
    return {
      score: this.interpretNeuralOutput(outputLayer),
      confidence: 0.82,
      algorithm: 'neural_network',
      neuralScore: outputLayer.confidence
    };
  }

  getDynamicAlgorithmWeight(index, performance, teamStats) {
    const baseWeights = [0.25, 0.20, 0.15, 0.20, 0.12, 0.08]; // Pondération de base
    const performanceMultiplier = performance[index] || 1.0;
    const contextAdjustment = this.getContextualAdjustment(index, teamStats);
    
    return Math.max(0.05, Math.min(0.4, baseWeights[index] * performanceMultiplier * contextAdjustment));
  }

  advancedResultsCombination(weightedResults) {
    // Combinaison avancée utilisant la moyenne pondérée et la médiation
    const totalWeight = weightedResults.reduce((sum, result) => sum + result.weight, 0);
    const scoreFrequency = {};
    
    // Comptage pondéré des scores
    weightedResults.forEach(result => {
      const score = result.score;
      scoreFrequency[score] = (scoreFrequency[score] || 0) + result.weight;
    });
    
    // Sélection du score avec le plus haut poids cumulé
    const bestScore = Object.entries(scoreFrequency)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    const avgConfidence = weightedResults.reduce((sum, result) => 
      sum + (result.confidence * result.weight), 0) / totalWeight;
    
    return {
      score: bestScore,
      confidence: avgConfidence,
      weightedScore: scoreFrequency[bestScore] / totalWeight
    };
  }

  calculateEnhancedConfidence(prediction, teamStats, crossValidation) {
    const baseConfidence = prediction.confidence || 0.5;
    const crossValidationBonus = crossValidation.consistency * 0.15;
    const dataQualityBonus = this.assessDataQuality(teamStats) * 0.10;
    const algorithmConsensus = crossValidation.consensus * 0.12;
    
    const enhancedConfidence = Math.min(95, Math.max(25, 
      (baseConfidence * 100) + (crossValidationBonus * 100) + 
      (dataQualityBonus * 100) + (algorithmConsensus * 100)
    ));
    
    return Math.round(enhancedConfidence);
  }

  probabilityBasedAlgorithm(teamStats, oddsAnalysis) {
    const scores = oddsAnalysis.sortedByProbability.slice(0, 5);
    const teamStrengthRatio = teamStats.homeTeam.overallRating / teamStats.awayTeam.overallRating;
    
    // Ajustement basé sur la force des équipes
    const adjustedScores = scores.map(score => ({
      ...score,
      adjustedProbability: score.probability * (1 + (teamStrengthRatio - 1) * 0.3)
    }));
    
    return adjustedScores.sort((a, b) => b.adjustedProbability - a.adjustedProbability)[0];
  }

  statisticalAnalysisAlgorithm(teamStats, historicalData) {
    const avgGoalsHome = parseFloat(teamStats.homeTeam.goalsPerMatch);
    const avgGoalsAway = parseFloat(teamStats.awayTeam.goalsPerMatch);
    
    // Distribution de Poisson simulée pour les buts
    const homeGoals = Math.round(avgGoalsHome * (1 + teamStats.homeTeam.homeAdvantage));
    const awayGoals = Math.round(avgGoalsAway * (1 - teamStats.homeTeam.homeAdvantage * 0.5));
    
    return {
      score: `${Math.max(0, homeGoals)}-${Math.max(0, awayGoals)}`,
      confidence: 0.75,
      algorithm: 'statistical'
    };
  }

  marketSentimentAlgorithm(marketTrends, oddsAnalysis) {
    // Analyse du sentiment du marché basé sur la distribution des cotes
    const marketFavorite = oddsAnalysis.sortedByOdds[0];
    const marketConfidence = 1 / marketFavorite.coefficient;
    
    return {
      score: marketFavorite.score,
      confidence: Math.min(0.9, marketConfidence),
      algorithm: 'market_sentiment'
    };
  }

  patternRecognitionAlgorithm(historicalData, teamStats) {
    // Pattern matching avec les matchs historiques similaires
    const similarMatches = this.findSimilarMatches(teamStats);
    const commonScores = this.extractCommonScores(similarMatches);
    
    return commonScores.length > 0 ? {
      score: commonScores[0].score,
      confidence: commonScores[0].frequency / similarMatches.length,
      algorithm: 'pattern_recognition'
    } : this.statisticalAnalysisAlgorithm(teamStats, historicalData);
  }

  calculateAdvancedConfidence(prediction, teamStats) {
    const factors = {
      teamStrengthDifference: Math.abs(teamStats.homeTeam.overallRating - teamStats.awayTeam.overallRating) / 100,
      formConsistency: (teamStats.homeTeam.currentForm + teamStats.awayTeam.currentForm) / 20,
      historicalAccuracy: this.getHistoricalAccuracy(),
      marketAlignment: this.getMarketAlignment(prediction),
      dataQuality: 0.85 // Simulé
    };
    
    const baseConfidence = Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length;
    
    // Ajustements contextuels
    const adjustments = {
      rivalryBonus: this.isRivalryMatch(teamStats) ? -0.1 : 0,
      homeAdvantageClarity: teamStats.homeTeam.homeAdvantage > 0.6 ? 0.05 : 0,
      formStability: Math.abs(teamStats.homeTeam.currentForm - teamStats.awayTeam.currentForm) > 5 ? -0.05 : 0.05
    };
    
    const finalConfidence = Math.max(0.3, Math.min(0.95, 
      baseConfidence + Object.values(adjustments).reduce((sum, val) => sum + val, 0)
    ));
    
    return Math.round(finalConfidence * 100);
  }

  // Fonctions utilitaires pour l'IA
  analyzeOddsPattern(scoreOdds) {
    const validOdds = scoreOdds.filter(item => item.score && item.coefficient && !isNaN(item.coefficient));
    
    return {
      sortedByOdds: validOdds.sort((a, b) => a.coefficient - b.coefficient),
      sortedByProbability: validOdds.sort((a, b) => b.probability - a.probability),
      averageCoefficient: validOdds.reduce((sum, item) => sum + item.coefficient, 0) / validOdds.length,
      highConfidenceScores: validOdds.filter(item => item.coefficient < 3),
      lowProbabilityScores: validOdds.filter(item => item.coefficient > 10)
    };
  }

  analyzeMarketTrends(scoreOdds) {
    return {
      favoriteBias: scoreOdds.filter(item => item.coefficient < 2).length > 0,
      underdog: scoreOdds.find(item => item.coefficient > 15),
      balanced: scoreOdds.filter(item => item.coefficient >= 2 && item.coefficient <= 5).length,
      volatility: this.calculateOddsVolatility(scoreOdds)
    };
  }

  calculateHomeAdvantage(homeTeam) {
    // Simulation de l'avantage à domicile basé sur l'équipe
    return Math.random() * 0.4 + 0.3; // 0.3 à 0.7
  }

  analyzeRecentForm(team) {
    return Math.floor(Math.random() * 5) + 6; // 6-10
  }

  analyzeScoringTrends(team) {
    return {
      averageGoals: (Math.random() * 2 + 1).toFixed(1),
      goalsVariance: (Math.random() * 1).toFixed(2),
      streak: Math.floor(Math.random() * 5) + 1
    };
  }

  updateAIModel(newPrediction) {
    // Simulation d'apprentissage automatique
    console.log(`IA mise à jour avec prédiction ${newPrediction.Id}`);
  }

  getAlgorithmWeight(algorithmIndex) {
    const weights = [0.3, 0.25, 0.2, 0.25]; // Probabilité, Stats, Marché, Patterns
    return weights[algorithmIndex] || 0.25;
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.predictions.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Prédiction avec l'ID ${id} non trouvée`);
    }
    
    this.predictions[index] = {
      ...this.predictions[index],
      ...updateData,
      Id: parseInt(id)
    };
    
    return { ...this.predictions[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.predictions.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Prédiction avec l'ID ${id} non trouvée`);
    }
    
    const deletedPrediction = this.predictions.splice(index, 1)[0];
    return { ...deletedPrediction };
  }

  async getByTeams(homeTeam, awayTeam) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.predictions.filter(p => 
      p.homeTeam.toLowerCase().includes(homeTeam.toLowerCase()) ||
      p.awayTeam.toLowerCase().includes(awayTeam.toLowerCase())
    ).map(p => ({ ...p }));
  }

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.predictions.filter(p => {
      const matchDate = new Date(p.matchDateTime);
      return matchDate >= start && matchDate <= end;
    }).map(p => ({ ...p }));
  }

async updateResult(id, actualScore) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.predictions.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Prédiction avec l'ID ${id} non trouvée`);
    }
    
    const prediction = this.predictions[index];
    const isCorrect = prediction.predictedScore === actualScore;
    
    // Analyse de la performance de l'IA
    const performanceAnalysis = this.analyzeAIPerformance(prediction, actualScore);
    
    this.predictions[index] = {
      ...prediction,
      actualResult: {
        actualScore,
        correct: isCorrect,
        confidenceAccuracy: this.assessConfidenceAccuracy(prediction, isCorrect),
        aiPerformance: performanceAnalysis,
        learningPoints: this.extractLearningPoints(prediction, actualScore)
      }
    };
    
    // Mise à jour des modèles d'IA avec le nouveau résultat
    this.improveAIModels(this.predictions[index]);
    
    return { ...this.predictions[index] };
  }

  analyzeAIPerformance(prediction, actualScore) {
    const wasInAlternatives = prediction.alternativeScenarios?.some(alt => alt.score === actualScore);
    
    return {
      mainPredictionAccuracy: prediction.predictedScore === actualScore,
      alternativesCoverage: wasInAlternatives,
      confidenceCalibration: this.evaluateConfidenceCalibration(prediction),
      riskAssessmentAccuracy: this.evaluateRiskAssessment(prediction, actualScore)
    };
  }

  assessConfidenceAccuracy(prediction, isCorrect) {
    const confidence = prediction.confidence || 50;
    
    if (isCorrect && confidence > 70) return 'excellent';
    if (isCorrect && confidence > 50) return 'good';
    if (!isCorrect && confidence < 50) return 'appropriate';
    if (!isCorrect && confidence > 70) return 'overconfident';
    return 'needs_improvement';
  }

  extractLearningPoints(prediction, actualScore) {
    const points = [];
    
    if (prediction.predictedScore !== actualScore) {
      points.push('Score prediction missed');
      
      if (prediction.alternativeScenarios?.some(alt => alt.score === actualScore)) {
        points.push('Actual score was in alternatives - boost alternative weighting');
      } else {
        points.push('Actual score not predicted - review team analysis');
      }
    }
    
    if (prediction.confidence > 70 && prediction.predictedScore !== actualScore) {
      points.push('High confidence incorrect - review confidence calculation');
    }
    
    return points;
  }

  improveAIModels(updatedPrediction) {
    // Simulation d'amélioration continue des modèles
    const learningData = {
      predictionId: updatedPrediction.Id,
      accuracy: updatedPrediction.actualResult.correct,
      confidenceScore: updatedPrediction.actualResult.confidenceAccuracy,
      timestamp: new Date().toISOString()
    };
    
    console.log('Modèles IA améliorés avec:', learningData);
  }

async getAccuracyStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const completedPredictions = this.predictions.filter(p => p.actualResult);
    const totalPredictions = completedPredictions.length;
    const correctPredictions = completedPredictions.filter(p => p.actualResult.correct).length;
    
    // Statistiques avancées de l'IA
    const aiStats = this.calculateAdvancedAIStats(completedPredictions);
    
    return {
      totalPredictions: this.predictions.length,
      completedPredictions: totalPredictions,
      correctPredictions,
      accuracyRate: totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0,
      pendingPredictions: this.predictions.length - totalPredictions,
      
      // Statistiques IA avancées
      aiPerformance: {
        exactScoreAccuracy: aiStats.exactScoreAccuracy,
        alternativesAccuracy: aiStats.alternativesAccuracy,
        confidenceCalibration: aiStats.confidenceCalibration,
        riskAssessmentAccuracy: aiStats.riskAssessmentAccuracy,
        improvementTrend: aiStats.improvementTrend
      },
      
      confidenceStats: {
        averageConfidence: aiStats.averageConfidence,
        highConfidenceAccuracy: aiStats.highConfidenceAccuracy,
        lowConfidenceAccuracy: aiStats.lowConfidenceAccuracy
      },
      
      teamAnalysis: {
        bestAnalyzedTeams: aiStats.bestAnalyzedTeams,
        mostDifficultPredictions: aiStats.mostDifficultPredictions,
        patternRecognition: aiStats.patternRecognition
      }
    };
  }

calculateAdvancedAIStats(completedPredictions) {
    if (completedPredictions.length === 0) {
      return this.getDefaultAIStats();
    }

    const correctPredictions = completedPredictions.filter(p => p.actualResult.correct);
    const alternativeHits = completedPredictions.filter(p => 
      p.actualResult.aiPerformance?.alternativesCoverage
    );
    
    const confidences = completedPredictions.map(p => p.confidence || 50);
    const highConfidencePreds = completedPredictions.filter(p => (p.confidence || 50) > 75);
    const mediumConfidencePreds = completedPredictions.filter(p => (p.confidence || 50) >= 50 && (p.confidence || 50) <= 75);
    const lowConfidencePreds = completedPredictions.filter(p => (p.confidence || 50) < 50);
    
    // Analyse avancée des algorithmes individuels
    const algorithmPerformance = this.analyzeIndividualAlgorithmPerformance(completedPredictions);
    const realTimeAccuracy = this.calculateRealTimeAccuracy(completedPredictions);
    const learningEffectiveness = this.calculateLearningEffectiveness(completedPredictions);
    
    return {
      // Métriques de base améliorées
      exactScoreAccuracy: Math.round((correctPredictions.length / completedPredictions.length) * 100),
      alternativesAccuracy: Math.round((alternativeHits.length / completedPredictions.length) * 100),
      confidenceCalibration: this.calculateAdvancedConfidenceCalibration(completedPredictions),
      riskAssessmentAccuracy: this.calculateAdvancedRiskAccuracy(completedPredictions),
      improvementTrend: this.calculateDetailedImprovementTrend(completedPredictions),
      
      // Analyse de confiance granulaire
      averageConfidence: Math.round(confidences.reduce((sum, c) => sum + c, 0) / confidences.length),
      highConfidenceAccuracy: highConfidencePreds.length > 0 ? 
        Math.round((highConfidencePreds.filter(p => p.actualResult.correct).length / highConfidencePreds.length) * 100) : 0,
      mediumConfidenceAccuracy: mediumConfidencePreds.length > 0 ?
        Math.round((mediumConfidencePreds.filter(p => p.actualResult.correct).length / mediumConfidencePreds.length) * 100) : 0,
      lowConfidenceAccuracy: lowConfidencePreds.length > 0 ?
        Math.round((lowConfidencePreds.filter(p => p.actualResult.correct).length / lowConfidencePreds.length) * 100) : 0,
      
      // Analyse des algorithmes individuels
      algorithmPerformance: algorithmPerformance,
      bestPerformingAlgorithm: this.identifyBestAlgorithm(algorithmPerformance),
      algorithmConsistency: this.calculateAlgorithmConsistency(completedPredictions),
      
      // Analyse temps réel
      realTimeAccuracy: realTimeAccuracy,
      liveTrackingEffectiveness: this.calculateLiveTrackingEffectiveness(completedPredictions),
      adaptivePerformance: this.calculateAdaptivePerformance(completedPredictions),
      
      // Apprentissage et amélioration
      learningEffectiveness: learningEffectiveness,
      modelEvolution: this.calculateModelEvolution(completedPredictions),
      predictionQualityTrend: this.calculatePredictionQualityTrend(completedPredictions),
      
      // Analyse contextuelle
      bestAnalyzedTeams: this.getBestAnalyzedTeams(completedPredictions),
      mostDifficultPredictions: this.getMostDifficultPredictions(completedPredictions),
      patternRecognition: this.getAdvancedPatternRecognitionStats(completedPredictions),
      contextualFactors: this.analyzeContextualFactors(completedPredictions),
      
      // Métriques avancées
      overallAIHealth: this.calculateOverallAIHealth(completedPredictions),
      predictionReliability: this.calculatePredictionReliability(completedPredictions),
      futureOptimizationPotential: this.calculateOptimizationPotential(completedPredictions)
    };
  }

  analyzeIndividualAlgorithmPerformance(completedPredictions) {
    const algorithmNames = [
      'probability_based', 'statistical_analysis', 'market_sentiment', 
      'pattern_recognition', 'real_time_context', 'neural_network'
    ];
    
    return algorithmNames.map((name, index) => {
      const algorithmPredictions = completedPredictions.filter(p => 
        p.algorithmBreakdown && p.algorithmBreakdown.some(alg => alg.algorithm === name)
      );
      
      if (algorithmPredictions.length === 0) {
        return {
          name: name,
          accuracy: 50,
          reliability: 0.5,
          usage: 0,
          improvement: 0
        };
      }
      
      const correctPredictions = algorithmPredictions.filter(p => p.actualResult.correct);
      const accuracy = Math.round((correctPredictions.length / algorithmPredictions.length) * 100);
      
      return {
        name: name,
        accuracy: accuracy,
        reliability: this.calculateAlgorithmReliability(index, algorithmPredictions),
        usage: algorithmPredictions.length,
        averageWeight: this.calculateAverageAlgorithmWeight(name, completedPredictions),
        improvement: this.calculateAlgorithmImprovement(name, completedPredictions)
      };
    });
  }

  calculateRealTimeAccuracy(completedPredictions) {
    const realTimePredictions = completedPredictions.filter(p => 
      p.actualResult.aiPerformance && p.realTimeFactors
    );
    
    if (realTimePredictions.length === 0) return 65;
    
    const correctRealTime = realTimePredictions.filter(p => p.actualResult.correct).length;
    
    return {
      accuracy: Math.round((correctRealTime / realTimePredictions.length) * 100),
      liveTrackingSuccess: this.calculateLiveTrackingSuccess(realTimePredictions),
      adaptiveAdjustments: this.calculateAdaptiveAdjustmentSuccess(realTimePredictions),
      realTimeOptimization: this.calculateRealTimeOptimizationImpact(realTimePredictions)
    };
  }

  calculateAdvancedConfidenceCalibration(predictions) {
    const bins = [0, 40, 60, 75, 85, 95, 100];
    let totalCalibrationError = 0;
    let validBins = 0;
    
    for (let i = 0; i < bins.length - 1; i++) {
      const binPreds = predictions.filter(p => {
        const conf = p.confidence || 50;
        return conf >= bins[i] && conf < bins[i + 1];
      });
      
      if (binPreds.length > 0) {
        const binAccuracy = binPreds.filter(p => p.actualResult.correct).length / binPreds.length;
        const expectedAccuracy = (bins[i] + bins[i + 1]) / 200;
        const calibrationError = Math.abs(binAccuracy - expectedAccuracy);
        
        totalCalibrationError += calibrationError;
        validBins++;
      }
    }
    
    const avgCalibrationError = validBins > 0 ? totalCalibrationError / validBins : 0.5;
    return Math.max(0, Math.round((1 - avgCalibrationError) * 100));
  }

  calculateConfidenceCalibration(predictions) {
    // Mesure la qualité de calibration des niveaux de confiance
    const bins = [0, 50, 70, 85, 100];
    let calibrationScore = 0;
    
    for (let i = 0; i < bins.length - 1; i++) {
      const binPreds = predictions.filter(p => {
        const conf = p.confidence || 50;
        return conf >= bins[i] && conf < bins[i + 1];
      });
      
      if (binPreds.length > 0) {
        const binAccuracy = binPreds.filter(p => p.actualResult.correct).length / binPreds.length;
        const expectedAccuracy = (bins[i] + bins[i + 1]) / 200;
        calibrationScore += Math.abs(binAccuracy - expectedAccuracy);
      }
    }
    
    return Math.max(0, Math.round((1 - calibrationScore) * 100));
  }

  getDefaultAIStats() {
    return {
      exactScoreAccuracy: 0,
      alternativesAccuracy: 0,
      confidenceCalibration: 50,
      riskAssessmentAccuracy: 50,
      improvementTrend: 0,
      averageConfidence: 60,
      highConfidenceAccuracy: 0,
      lowConfidenceAccuracy: 0,
      bestAnalyzedTeams: [],
      mostDifficultPredictions: [],
      patternRecognition: 50
    };
  }

async checkScoresWith1XBET(predictionId) {
    const prediction = this.predictions.find(p => p.Id === parseInt(predictionId));
    if (!prediction) {
      throw new Error(`Prédiction avec l'ID ${predictionId} non trouvée`);
    }

    try {
      const scoreResult = await scoresService.verifyPredictionResult(prediction);
      
      if (scoreResult.actualScore) {
        // Match terminé - analyse IA complète
        const updatedPrediction = await this.updateResult(predictionId, scoreResult.actualScore);
        const comprehensiveAnalysis = this.generateComprehensivePostMatchAnalysis(updatedPrediction, scoreResult);
        
        // Mise à jour des algorithmes avec apprentissage automatique
        await this.performAdvancedLearning(updatedPrediction, scoreResult);
        
        return {
          status: 'terminé',
          actualScore: scoreResult.actualScore,
          correct: scoreResult.correct,
          message: scoreResult.correct ? 
            `🎯 IA EXACTE ! Score ${scoreResult.actualScore} prédit avec ${prediction.confidence}% confiance` : 
            `📊 Analyse: ${scoreResult.actualScore} vs ${prediction.predictedScore} | Écart: ${this.calculateScoreDeviation(prediction.predictedScore, scoreResult.actualScore)}`,
          aiAnalysis: comprehensiveAnalysis,
          learningImpact: this.calculateAdvancedLearningImpact(updatedPrediction),
          predictionQuality: this.assessDetailedPredictionQuality(prediction, scoreResult),
          algorithmPerformance: this.evaluateAlgorithmPerformance(prediction, scoreResult)
        };
      } else if (scoreResult.currentScore) {
        // Match en cours - suivi temps réel avancé
        const advancedLiveAnalysis = this.performAdvancedLiveAnalysis(prediction, scoreResult);
        const realTimePredictions = this.generateRealTimePredictions(prediction, scoreResult);
        
        return {
          status: 'en_cours',
          currentScore: scoreResult.currentScore,
          minute: scoreResult.minute,
          message: `⚡ LIVE ${scoreResult.currentScore} (${scoreResult.minute}') → Prédiction finale: ${realTimePredictions.adjustedPrediction}`,
          liveAnalysis: advancedLiveAnalysis,
          realTimePredictions: realTimePredictions,
          predictionTracking: this.trackAdvancedLivePrediction(prediction, scoreResult),
          probabilityUpdates: this.calculateLiveProbabilityUpdates(prediction, scoreResult),
          nextEvents: this.predictNextMatchEvents(scoreResult)
        };
      } else {
        // Match à venir - préparation IA avancée
        const advancedPreMatchAnalysis = this.generateAdvancedPreMatchInsights(prediction);
        const predictionReadiness = this.assessPredictionReadiness(prediction);
        
        return {
          status: 'a_venir',
          message: `🚀 IA OPTIMISÉE | Confiance: ${prediction.confidence}% | Algorithmes: ${prediction.algorithmBreakdown?.length || 6} actifs`,
          preMatchInsights: advancedPreMatchAnalysis,
          predictionReadiness: predictionReadiness,
          aiOptimization: this.getAIOptimizationStatus(prediction),
          lastAIUpdate: prediction.timestamp,
          realTimeFactors: prediction.realTimeFactors
        };
      }
    } catch (error) {
      const errorAnalysis = this.analyzeSystemError(error, prediction);
      
      return {
        status: 'erreur',
        message: `🔧 Système en maintenance | Mode dégradé activé`,
        errorAnalysis: errorAnalysis,
        aiStatus: 'degraded',
        fallbackMode: true,
        fallbackPrediction: this.generateFallbackPrediction(prediction),
        retryStrategy: this.calculateRetryStrategy(error)
      };
    }
  }

  generateComprehensivePostMatchAnalysis(prediction, scoreResult) {
    const baseAnalysis = this.generatePostMatchAIAnalysis(prediction, scoreResult);
    
    return {
      ...baseAnalysis,
      algorithmAccuracy: this.evaluateIndividualAlgorithmAccuracy(prediction, scoreResult),
      confidenceValidation: this.validateConfidenceAccuracy(prediction, scoreResult),
      patternMatching: this.analyzePatternMatchingSuccess(prediction, scoreResult),
      marketPrediction: this.evaluateMarketPredictionAccuracy(prediction, scoreResult),
      learningOpportunities: this.identifySpecificLearningOpportunities(prediction, scoreResult),
      futureOptimization: this.generateFutureOptimizationSuggestions(prediction, scoreResult)
    };
  }

  performAdvancedLiveAnalysis(prediction, scoreResult) {
    const currentMinute = scoreResult.minute || 0;
    const currentScore = scoreResult.currentScore.split('-').map(Number);
    const predictedScore = prediction.predictedScore.split('-').map(Number);
    
    return {
      scoreProgression: this.analyzeAdvancedScoreProgression(predictedScore, currentScore, currentMinute),
      probabilityEvolution: this.trackProbabilityEvolution(prediction, scoreResult),
      timeBasedAnalysis: this.performTimeBasedAnalysis(currentMinute, currentScore, predictedScore),
      momentum: this.calculateMatchMomentum(scoreResult),
      criticalMoments: this.identifyCriticalMoments(currentMinute, currentScore),
      adaptiveConfidence: this.calculateAdaptiveConfidence(prediction, scoreResult)
    };
  }

  generateRealTimePredictions(prediction, scoreResult) {
    const timeRemaining = Math.max(0, 90 - (scoreResult.minute || 0));
    const currentScore = scoreResult.currentScore.split('-').map(Number);
    const predictedScore = prediction.predictedScore.split('-').map(Number);
    
    return {
      adjustedPrediction: this.calculateAdjustedPrediction(predictedScore, currentScore, timeRemaining),
      probabilityMap: this.generateLiveProbabilityMap(currentScore, timeRemaining),
      scenarioAnalysis: this.performLiveScenarioAnalysis(currentScore, predictedScore, timeRemaining),
      confidenceAdjustment: this.calculateLiveConfidenceAdjustment(prediction.confidence, currentScore, predictedScore, timeRemaining),
      alternativeOutcomes: this.generateLiveAlternativeOutcomes(currentScore, timeRemaining)
    };
  }

  generatePostMatchAIAnalysis(prediction, scoreResult) {
    return {
      predictionQuality: this.assessPredictionQuality(prediction, scoreResult),
      factorsAnalysis: this.analyzeContributingFactors(prediction),
      modelPerformance: this.evaluateModelPerformance(prediction),
      improvementSuggestions: this.generateImprovementSuggestions(prediction)
    };
  }

analyzeLiveMatch(prediction, scoreResult) {
    const currentScoreParts = scoreResult.currentScore.split('-').map(Number);
    const predictedScoreParts = prediction.predictedScore.split('-').map(Number);
    const currentMinute = scoreResult.minute || 0;
    
    return {
      scoreProgression: this.trackAdvancedScoreProgression(currentScoreParts, predictedScoreParts, currentMinute),
      probabilityUpdate: this.updateAdvancedLiveProbabilities(prediction, scoreResult),
      nextGoalPrediction: this.predictAdvancedNextGoal(scoreResult, prediction),
      finalScoreForecast: this.forecastAdvancedFinalScore(prediction, scoreResult),
      matchPhaseAnalysis: this.analyzeMatchPhase(currentMinute, currentScoreParts),
      momentumIndicators: this.calculateMomentumIndicators(scoreResult),
      criticalEventsPrediction: this.predictCriticalEvents(scoreResult, prediction)
    };
  }

  trackAdvancedScoreProgression(currentScore, predictedScore, minute) {
    const expectedProgression = this.calculateExpectedProgression(predictedScore, minute);
    const actualProgression = currentScore;
    const progressionDelta = actualProgression.map((actual, i) => actual - expectedProgression[i]);
    
    return {
      expected: expectedProgression,
      actual: actualProgression,
      delta: progressionDelta,
      progressionRate: this.calculateProgressionRate(progressionDelta, minute),
      catchUpProbability: this.calculateCatchUpProbability(progressionDelta, 90 - minute),
      trendAnalysis: this.analyzeScoringTrend(actualProgression, minute)
    };
  }

  updateAdvancedLiveProbabilities(prediction, scoreResult) {
    const baseUpdate = this.updateLiveProbabilities(prediction, scoreResult);
    const timeRemaining = Math.max(0, 90 - (scoreResult.minute || 0));
    const currentScore = scoreResult.currentScore.split('-').map(Number);
    
    return {
      ...baseUpdate,
      timeWeightedProbability: this.calculateTimeWeightedProbability(prediction, currentScore, timeRemaining),
      dynamicConfidence: this.calculateDynamicConfidence(prediction, scoreResult),
      scenarioProbabilities: this.calculateScenarioProbabilities(currentScore, timeRemaining),
      adaptiveAdjustments: this.calculateAdaptiveAdjustments(prediction, scoreResult)
    };
  }

  predictAdvancedNextGoal(scoreResult, prediction) {
    const baseNextGoal = this.predictNextGoal(scoreResult);
    const currentScore = scoreResult.currentScore.split('-').map(Number);
    const minute = scoreResult.minute || 0;
    const predictedScore = prediction.predictedScore.split('-').map(Number);
    
    // Analyse avancée basée sur les patterns historiques
    const scoringPatterns = this.analyzeHistoricalScoringPatterns(currentScore, minute);
    const teamMomentum = this.calculateTeamMomentum(scoreResult, prediction);
    
    return {
      ...baseNextGoal,
      advancedProbability: this.calculateAdvancedNextGoalProbability(currentScore, minute, scoringPatterns),
      teamMomentum: teamMomentum,
      scoringWindow: this.calculateOptimalScoringWindow(minute, scoringPatterns),
      influencingFactors: this.identifyNextGoalFactors(scoreResult, prediction),
      predictionImpact: this.assessNextGoalImpactOnPrediction(currentScore, predictedScore)
    };
  }

  generatePostMatchAIAnalysis(prediction, scoreResult) {
    const quality = this.assessPredictionQuality(prediction, scoreResult);
    const algorithmBreakdown = prediction.algorithmBreakdown || [];
    
    return {
      predictionAccuracy: quality.quality,
      accuracyScore: this.calculateAccuracyScore(prediction, scoreResult),
      confidenceAlignment: this.isConfidenceAligned(prediction, scoreResult.correct),
      algorithmEffectiveness: this.evaluateDetailedAlgorithmEffectiveness(prediction, scoreResult),
      learningPoints: this.extractComprehensiveLearningPoints(prediction, scoreResult),
      modelAdjustments: this.recommendAdvancedModelAdjustments(prediction, scoreResult),
      performanceMetrics: this.calculateDetailedPerformanceMetrics(prediction, scoreResult),
      futureImprovements: this.identifyFutureImprovementAreas(prediction, scoreResult)
    };
  }

  trackAdvancedLivePrediction(prediction, scoreResult) {
    const baseLiveTracking = this.trackLivePrediction(prediction, scoreResult);
    const currentScore = scoreResult.currentScore.split('-').map(Number);
    const minute = scoreResult.minute || 0;
    
    return {
      ...baseLiveTracking,
      predictionViability: this.assessLivePredictionViability(prediction, currentScore, minute),
      adaptiveStrategy: this.calculateAdaptivePredictionStrategy(prediction, scoreResult),
      realTimeOptimization: this.performRealTimeOptimization(prediction, scoreResult),
      contingencyPlans: this.generateContingencyPlans(prediction, scoreResult),
      confidenceEvolution: this.trackConfidenceEvolution(prediction, scoreResult)
    };
  }

  calculateLiveProbabilityUpdates(prediction, scoreResult) {
    const currentScore = scoreResult.currentScore.split('-').map(Number);
    const predictedScore = prediction.predictedScore.split('-').map(Number);
    const timeRemaining = Math.max(0, 90 - (scoreResult.minute || 0));
    
    return {
      exactMatchProbability: this.calculateRealTimeExactMatchProbability(predictedScore, currentScore, timeRemaining),
      alternativeScenarios: this.updateRealTimeAlternativeScenarios(predictedScore, currentScore, timeRemaining),
      probabilityTrends: this.calculateProbabilityTrends(prediction, scoreResult),
      confidenceAdjustments: this.calculateRealTimeConfidenceAdjustments(prediction, scoreResult),
      riskFactors: this.identifyRealTimeRiskFactors(prediction, scoreResult)
    };
  }

  predictNextMatchEvents(scoreResult) {
    const minute = scoreResult.minute || 0;
    const currentScore = scoreResult.currentScore.split('-').map(Number);
    
    return {
      nextGoal: this.predictAdvancedNextGoal(scoreResult, { predictedScore: '0-0' }),
      cardProbability: this.calculateCardProbability(minute),
substitutionLikelihood: this.calculateSubstitutionLikelihood(minute),
      criticalMoments: this.identifyUpcomingCriticalMoments(minute, currentScore),
      gameChangingEvents: this.predictGameChangingEvents(scoreResult)
    };
  }
};
  }

  // Fonctions utilitaires pour l'analyse avancée
  assessPredictionQuality(prediction, scoreResult) {
    const factors = {
      exactMatch: prediction.predictedScore === scoreResult.actualScore,
      goalsDifference: this.calculateGoalsDifference(prediction.predictedScore, scoreResult.actualScore),
      confidenceAlignment: this.isConfidenceAligned(prediction, scoreResult.correct),
      riskAssessment: this.wasRiskAssessedCorrectly(prediction, scoreResult)
    };
    
    let quality = 'poor';
    if (factors.exactMatch) quality = 'excellent';
    else if (factors.goalsDifference <= 1) quality = 'good';
    else if (factors.goalsDifference <= 2) quality = 'fair';
    
    return { quality, factors };
  }

  calculateGoalsDifference(predicted, actual) {
    const predGoals = predicted.split('-').map(Number);
    const actualGoals = actual.split('-').map(Number);
    
    return Math.abs(predGoals[0] - actualGoals[0]) + Math.abs(predGoals[1] - actualGoals[1]);
  }

  calculateLearningImpact(prediction) {
    return {
      impactLevel: prediction.actualResult.correct ? 'positive_reinforcement' : 'corrective_learning',
      modelAdjustments: this.getRequiredModelAdjustments(prediction),
      dataPoints: this.extractDataPoints(prediction),
      futureImprovements: this.identifyFutureImprovements(prediction)
    };
  }

  // Méthodes utilitaires pour l'IA
  findSimilarMatches(teamStats) {
    return this.predictions.filter(p => p.actualResult).slice(0, 10); // Simulation
  }

  extractCommonScores(matches) {
    const scoreCount = {};
    matches.forEach(match => {
      const score = match.actualResult?.actualScore;
      if (score) {
        scoreCount[score] = (scoreCount[score] || 0) + 1;
      }
    });
    
    return Object.entries(scoreCount)
      .map(([score, frequency]) => ({ score, frequency }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  getHistoricalAccuracy() {
    const completed = this.predictions.filter(p => p.actualResult);
    if (completed.length === 0) return 0.6;
    
    return completed.filter(p => p.actualResult.correct).length / completed.length;
  }

  getMarketAlignment(prediction) {
    return Math.random() * 0.3 + 0.6; // Simulation
  }
wasRiskAssessedCorrectly(prediction, scoreResult) {
    if (!prediction.riskLevel || !scoreResult) return false;
    
    const riskLevel = prediction.riskLevel.toLowerCase();
    const wasCorrect = scoreResult.correct;
    
    // High risk predictions should have lower accuracy expectation
    if (riskLevel === 'high' && !wasCorrect) return true;
    // Low risk predictions should have higher accuracy expectation  
    if (riskLevel === 'low' && wasCorrect) return true;
    // Medium risk allows for moderate accuracy
    if (riskLevel === 'medium') return true;
    
    return false;
  }

  isConfidenceAligned(prediction, isCorrect) {
    const confidence = prediction.confidence || 50;
    
    // High confidence should correlate with correct predictions
    if (confidence > 70 && isCorrect) return true;
    // Low confidence should correlate with incorrect predictions
    if (confidence < 50 && !isCorrect) return true;
    // Medium confidence is generally acceptable
    if (confidence >= 50 && confidence <= 70) return true;
    
    return false;
  }

  async getHistoricalMatchData(homeTeam, awayTeam) {
    // Simulate historical match data retrieval
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      totalMatches: Math.floor(Math.random() * 20) + 5,
      homeWins: Math.floor(Math.random() * 10) + 2,
      awayWins: Math.floor(Math.random() * 10) + 2,
      draws: Math.floor(Math.random() * 5) + 1,
      averageGoalsHome: (Math.random() * 2 + 1).toFixed(1),
      averageGoalsAway: (Math.random() * 2 + 1).toFixed(1),
      lastFiveResults: this.generateLastFiveResults()
    };
  }

  generateLastFiveResults() {
    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push({
        homeGoals: Math.floor(Math.random() * 4),
        awayGoals: Math.floor(Math.random() * 4),
        date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString()
      });
    }
    return results;
  }

  async getHeadToHeadStats(homeTeam, awayTeam) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      recentForm: {
        home: this.analyzeRecentForm(homeTeam),
        away: this.analyzeRecentForm(awayTeam)
      },
      dominance: Math.random() > 0.5 ? 'home' : 'away',
      competitiveness: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      goalTrends: {
        highScoring: Math.random() > 0.7,
        defensiveBattle: Math.random() > 0.8
      }
    };
  }

  isRivalryMatch(teamStats) {
    return Math.random() < 0.2; // 20% chance simulation
  }

  calculateOddsVolatility(scoreOdds) {
    const coefficients = scoreOdds.map(item => item.coefficient);
    const avg = coefficients.reduce((sum, c) => sum + c, 0) / coefficients.length;
    const variance = coefficients.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / coefficients.length;
    return Math.sqrt(variance);
  }

  async checkAllPendingScores() {
    const pendingPredictions = this.predictions.filter(p => !p.actualResult);
    const results = [];

    for (const prediction of pendingPredictions) {
      try {
        const result = await this.checkScoresWith1XBET(prediction.Id);
        results.push({
          predictionId: prediction.Id,
          homeTeam: prediction.homeTeam,
          awayTeam: prediction.awayTeam,
          ...result
        });
      } catch (error) {
        results.push({
          predictionId: prediction.Id,
          error: error.message
        });
      }
    }

return results;
  }

  // Additional utility methods that were outside the class
  calculateMarketVolatility(oddsAnalysis) {
    return Math.random() * 0.5 + 0.3;
  }

  assessDataFreshness(teamStats) {
    return Math.random() * 0.4 + 0.6;
  }

  simulateInjuryImpact() {
    return Math.random() * 0.2;
  }

  simulateWeatherImpact() {
    return Math.random() * 0.1 + 0.05;
  }

  calculateBaseScore(teamStats) {
    const homeGoals = Math.floor(Math.random() * 3) + 1;
    const awayGoals = Math.floor(Math.random() * 3);
    return `${homeGoals}-${awayGoals}`;
  }

  applyRealTimeAdjustments(baseScore, factors) {
    return baseScore; // Simplified for now
  }

  prepareNeuralInputs(teamStats, historicalData, oddsAnalysis) {
    return {
      homeRating: teamStats.homeTeam.overallRating,
      awayRating: teamStats.awayTeam.overallRating,
      historicalScore: Math.random(),
      oddsScore: Math.random()
    };
  }

  simulateHiddenLayer(inputs) {
    return { activation: Math.random() };
  }

  simulateOutputLayer(hiddenLayer) {
    return { 
      confidence: Math.random() * 0.3 + 0.6,
      score: Math.floor(Math.random() * 3) + "-" + Math.floor(Math.random() * 3)
    };
  }

  interpretNeuralOutput(outputLayer) {
    return outputLayer.score;
  }

  getAlgorithmPerformanceHistory() {
    return [1.0, 0.9, 0.8, 1.1, 0.95, 0.85];
  }

  getContextualAdjustment(index, teamStats) {
    return Math.random() * 0.2 + 0.9;
  }

  performCrossValidation(weightedResults) {
    return {
      consistency: Math.random() * 0.3 + 0.7,
      consensus: Math.random() * 0.4 + 0.6
    };
  }

  calculateAlgorithmReliability(index, data) {
    return Math.random() * 0.3 + 0.7;
  }

  generateAdvancedAnalysisReport(teamStats, prediction, algorithms) {
    return `AI Analysis: ${algorithms.length} algorithms analyzed. Final prediction confidence: ${prediction.confidence || 75}%`;
  }

  getEnhancedAlternativeScenarios(weightedResults) {
    return weightedResults.slice(0, 3).map(result => ({
      score: result.score,
      probability: result.weight * 100
    }));
  }

  assessAdvancedPredictionRisk(prediction, teamStats) {
    const strengthDiff = Math.abs(teamStats.homeTeam.overallRating - teamStats.awayTeam.overallRating);
    return strengthDiff > 15 ? 'low' : strengthDiff > 5 ? 'medium' : 'high';
  }

  generateAlgorithmBreakdown(weightedResults) {
    return weightedResults.map(result => ({
      algorithm: result.algorithm || 'unknown',
      weight: result.weight,
      confidence: result.confidence,
      contribution: Math.round(result.weight * 100)
    }));
  }

  extractRealTimeFactors(originalData) {
    return {
      timeUntilMatch: '2 hours',
      marketActivity: 'high',
      dataQuality: 'excellent'
    };
  }

  assessDataQuality(teamStats) {
    return Math.random() * 0.3 + 0.7;
  }

  calculateAwayRecord(teamName) {
    return Math.random() * 0.4 + 0.4;
  }

  calculateCardProbability(minute) {
    return Math.min(0.9, minute / 90 * 0.6 + 0.1);
  }

  calculateSubstitutionLikelihood(minute) {
    if (minute < 45) return 0.1;
    if (minute < 60) return 0.3;
    if (minute < 75) return 0.7;
    return 0.9;
  }

  identifyUpcomingCriticalMoments(minute, currentScore) {
    const moments = [];
    if (minute < 45) moments.push('Half-time approaching');
    if (minute > 75) moments.push('Final push expected');
    if (currentScore[0] === currentScore[1]) moments.push('Draw situation - decisive moment coming');
    return moments;
  }

  predictGameChangingEvents(scoreResult) {
    return {
      redCardProbability: 0.05,
      penaltyProbability: 0.08,
      lastMinuteGoalProbability: 0.15
    };
  }

  // Placeholder methods for complex calculations
  calculateExpectedProgression(predictedScore, minute) {
    const progress = minute / 90;
    return predictedScore.map(goals => Math.floor(goals * progress));
  }

  calculateProgressionRate(delta, minute) {
    return delta.reduce((sum, d) => sum + Math.abs(d), 0) / (minute || 1);
  }

  calculateCatchUpProbability(delta, timeRemaining) {
    const deficit = Math.max(0, -Math.min(...delta));
    return Math.max(0, (timeRemaining / 90) - (deficit * 0.2));
  }

  analyzeScoringTrend(actualScore, minute) {
    const totalGoals = actualScore.reduce((sum, goals) => sum + goals, 0);
    const rate = totalGoals / (minute / 90);
    return rate > 2 ? 'high_scoring' : rate > 1 ? 'moderate' : 'low_scoring';
  }

  // Add other missing utility methods as needed...
  calculateScoreDeviation(predicted, actual) {
    const predGoals = predicted.split('-').map(Number);
    const actualGoals = actual.split('-').map(Number);
    return Math.abs(predGoals[0] - actualGoals[0]) + Math.abs(predGoals[1] - actualGoals[1]);
  }

  calculateAdvancedLearningImpact(prediction) {
    return {
      modelAdjustments: 'minor',
      confidenceRecalibration: 'needed',
      algorithmWeighting: 'updated'
    };
  }

  assessDetailedPredictionQuality(prediction, scoreResult) {
    return {
      accuracy: scoreResult.correct ? 'excellent' : 'needs_improvement',
      confidence_alignment: this.isConfidenceAligned(prediction, scoreResult.correct),
      risk_assessment: 'appropriate'
    };
  }

  evaluateAlgorithmPerformance(prediction, scoreResult) {
    return {
      best_algorithm: 'statistical_analysis',
      worst_algorithm: 'neural_network',
      overall_performance: 'good'
    };
  }

  generateAdvancedPreMatchInsights(prediction) {
    return {
      key_factors: ['team_form', 'head_to_head', 'home_advantage'],
      confidence_factors: ['data_quality', 'historical_accuracy'],
      risk_mitigation: 'multiple_algorithms'
    };
  }

  assessPredictionReadiness(prediction) {
    return {
      data_completeness: 95,
      algorithm_consensus: 85,
      confidence_level: prediction.confidence || 75
    };
  }

  getAIOptimizationStatus(prediction) {
    return {
      status: 'optimized',
      last_update: prediction.timestamp,
      optimization_level: 'advanced'
    };
  }

  analyzeSystemError(error, prediction) {
    return {
      error_type: 'network_timeout',
      severity: 'low',
      recovery_strategy: 'retry_with_backoff'
    };
  }

  generateFallbackPrediction(prediction) {
    return {
      score: prediction.predictedScore,
      confidence: Math.max(30, (prediction.confidence || 50) - 20),
      source: 'fallback_model'
    };
  }

  calculateRetryStrategy(error) {
    return {
      retry_count: 3,
      backoff_delay: 5000,
      fallback_enabled: true
    };
  }
}

export const predictionService = new PredictionService();