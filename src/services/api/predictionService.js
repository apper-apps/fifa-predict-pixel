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
    const algorithms = [
      this.probabilityBasedAlgorithm(teamStats, oddsAnalysis),
      this.statisticalAnalysisAlgorithm(teamStats, historicalData),
      this.marketSentimentAlgorithm(marketTrends, oddsAnalysis),
      this.patternRecognitionAlgorithm(historicalData, teamStats)
    ];
    
    // Weighted ensemble de différents algorithmes
    const weightedResults = algorithms.map((result, index) => ({
      ...result,
      weight: this.getAlgorithmWeight(index)
    }));
    
    const finalPrediction = this.combineAlgorithmResults(weightedResults);
    
    return {
      mostLikelyScore: finalPrediction.score,
      confidence: this.calculateAdvancedConfidence(finalPrediction, teamStats),
      analysis: this.generateAnalysisReport(teamStats, finalPrediction),
      alternatives: this.getAlternativeScenarios(weightedResults),
      riskAssessment: this.assessPredictionRisk(finalPrediction, teamStats)
    };
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
    const highConfidencePreds = completedPredictions.filter(p => (p.confidence || 50) > 70);
    const lowConfidencePreds = completedPredictions.filter(p => (p.confidence || 50) < 50);
    
    return {
      exactScoreAccuracy: Math.round((correctPredictions.length / completedPredictions.length) * 100),
      alternativesAccuracy: Math.round((alternativeHits.length / completedPredictions.length) * 100),
      confidenceCalibration: this.calculateConfidenceCalibration(completedPredictions),
      riskAssessmentAccuracy: this.calculateRiskAccuracy(completedPredictions),
      improvementTrend: this.calculateImprovementTrend(completedPredictions),
      
      averageConfidence: Math.round(confidences.reduce((sum, c) => sum + c, 0) / confidences.length),
      highConfidenceAccuracy: highConfidencePreds.length > 0 ? 
        Math.round((highConfidencePreds.filter(p => p.actualResult.correct).length / highConfidencePreds.length) * 100) : 0,
      lowConfidenceAccuracy: lowConfidencePreds.length > 0 ?
        Math.round((lowConfidencePreds.filter(p => p.actualResult.correct).length / lowConfidencePreds.length) * 100) : 0,
      
      bestAnalyzedTeams: this.getBestAnalyzedTeams(completedPredictions),
      mostDifficultPredictions: this.getMostDifficultPredictions(completedPredictions),
      patternRecognition: this.getPatternRecognitionStats(completedPredictions)
    };
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
        // Match terminé - mettre à jour avec analyse IA
        const updatedPrediction = await this.updateResult(predictionId, scoreResult.actualScore);
        const aiAnalysis = this.generatePostMatchAIAnalysis(updatedPrediction, scoreResult);
        
        return {
          status: 'terminé',
          actualScore: scoreResult.actualScore,
          correct: scoreResult.correct,
          message: scoreResult.correct ? 
            `✅ Prédiction IA correcte ! Confiance: ${prediction.confidence}%` : 
            `❌ Score réel: ${scoreResult.actualScore} | Prédit: ${prediction.predictedScore}`,
          aiAnalysis: aiAnalysis,
          learningImpact: this.calculateLearningImpact(updatedPrediction)
        };
      } else if (scoreResult.currentScore) {
        // Match en cours - analyse temps réel
        const liveAnalysis = this.analyzeLiveMatch(prediction, scoreResult);
        
        return {
          status: 'en_cours',
          currentScore: scoreResult.currentScore,
          minute: scoreResult.minute,
          message: `⚽ ${scoreResult.currentScore} (${scoreResult.minute}') | Prédiction: ${prediction.predictedScore}`,
          liveAnalysis: liveAnalysis,
          predictionTracking: this.trackLivePrediction(prediction, scoreResult)
        };
      } else {
        // Match à venir - préparation IA
        const preMatchAnalysis = this.generatePreMatchInsights(prediction);
        
        return {
          status: 'a_venir',
          message: `⏳ Match prévu | IA prête avec ${prediction.confidence}% de confiance`,
          preMatchInsights: preMatchAnalysis,
          lastAIUpdate: prediction.timestamp
        };
      }
    } catch (error) {
      return {
        status: 'erreur',
        message: `🚨 Erreur système: ${error.message}`,
        aiStatus: 'degraded',
        fallbackMode: true
      };
    }
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
    const currentScoreParts = scoreResult.currentScore.split('-');
    const predictedScoreParts = prediction.predictedScore.split('-');
    
    return {
      scoreProgression: this.trackScoreProgression(currentScoreParts, predictedScoreParts),
      probabilityUpdate: this.updateLiveProbabilities(prediction, scoreResult),
      nextGoalPrediction: this.predictNextGoal(scoreResult),
      finalScoreForecast: this.forecastFinalScore(prediction, scoreResult)
    };
  }

  generatePreMatchInsights(prediction) {
    return {
      keyFactors: this.identifyKeyPredictionFactors(prediction),
      riskFactors: this.identifyRiskFactors(prediction),
      confidenceBreakdown: this.breakdownConfidence(prediction),
      similarHistoricalMatches: this.findSimilarHistoricalMatches(prediction)
    };
  }

  trackLivePrediction(prediction, scoreResult) {
return {
      accuracyTrend: this.calculateLiveAccuracyTrend(prediction, scoreResult),
      adjustedConfidence: this.adjustConfidenceInRealTime(prediction, scoreResult),
      alternativeScenarios: this.updateAlternativeScenarios(prediction, scoreResult)
    };
  }

  // Fonctions utilitaires pour l'analyse avancée
  assessPredictionQuality(prediction, scoreResult) {
    const factors = {
      exactMatch: prediction.predictedScore === scoreResult.actualScore,
      goalsDifference: this.calculateGoalsDifference(prediction.predictedScore, scoreResult.actualScore),
      confidenceAlignment: this.isConfidenceAligned(prediction, scoreResult.correct),
      riskAssessment: this.wasRiskAssessed Correctly(prediction, scoreResult)
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

  isRivalryMatch(teamStats) {
    return Math.random() < 0.2; // 20% chance simulation
  }

  calculateOddsVolatility(scoreOdds) {
    const coefficients = scoreOdds.map(item => item.coefficient);
    const avg = coefficients.reduce((sum, c) => sum + c, 0) / coefficients.length;
    const variance = coefficients.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / coefficients.length;
    return Math.sqrt(variance);
  }
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
}