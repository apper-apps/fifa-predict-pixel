import { xbetService } from "./xbetService";

class ScoresService {
  constructor() {
    this.cachedScores = new Map();
    this.lastUpdateTime = null;
  }

  async getMatchScore(homeTeam, awayTeam, matchDateTime) {
    try {
      // Créer une clé unique pour le match
      const matchKey = `${homeTeam.toLowerCase()}-${awayTeam.toLowerCase()}-${matchDateTime}`;
      
      // Vérifier le cache (valide pendant 2 minutes)
      const cached = this.cachedScores.get(matchKey);
      if (cached && (Date.now() - cached.timestamp) < 120000) {
        return cached.data;
      }

      // Récupérer le score depuis 1XBET
      const score = await xbetService.getMatchResult(homeTeam, awayTeam, matchDateTime);
      
      // Mettre en cache
      this.cachedScores.set(matchKey, {
        data: score,
        timestamp: Date.now()
      });

      return score;
    } catch (error) {
      console.error('Erreur lors de la récupération du score:', error);
      return {
        status: 'error',
        error: 'Impossible de récupérer le score depuis 1XBET'
      };
    }
  }

  async getLiveMatches() {
    try {
      return await xbetService.getLiveMatches();
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs en direct:', error);
      return [];
    }
  }

  async getFinishedMatches(date = new Date()) {
    try {
      return await xbetService.getFinishedMatches(date);
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs terminés:', error);
      return [];
    }
  }

  async checkMultipleMatches(matches) {
    const results = [];
    
    for (const match of matches) {
      try {
        const score = await this.getMatchScore(
          match.homeTeam, 
          match.awayTeam, 
          match.matchDateTime
        );
        
        results.push({
          matchId: match.Id,
          ...score
        });
      } catch (error) {
        results.push({
          matchId: match.Id,
          status: 'error',
          error: error.message
        });
      }
    }

    return results;
  }

  clearCache() {
    this.cachedScores.clear();
    this.lastUpdateTime = null;
  }

  getCacheStatus() {
    return {
      cacheSize: this.cachedScores.size,
      lastUpdate: this.lastUpdateTime
    };
  }

async verifyPredictionResult(prediction) {
    try {
      const score = await this.getMatchScore(
        prediction.homeTeam,
        prediction.awayTeam,
        prediction.dateTime || prediction.matchDateTime
      );

      if (score.status === 'finished' && score.finalScore) {
        // Match terminé - validation avec IA
        const aiValidation = this.validateWithAI(prediction, score);
        
        return {
          actualScore: score.finalScore,
          correct: prediction.predictedScore === score.finalScore,
          matchStatus: 'terminé',
          confidence: prediction.confidence || 50,
          aiValidation: aiValidation,
          predictionAccuracy: this.calculatePredictionAccuracy(prediction, score.finalScore),
          learningData: this.extractLearningData(prediction, score)
        };
      } else if (score.status === 'live' && score.currentScore) {
        // Match en cours - suivi temps réel
        const realTimeAnalysis = this.analyzeRealTimeProgression(prediction, score);
        
        return {
          currentScore: score.currentScore,
          matchStatus: 'en cours',
          minute: score.minute || 'N/A',
          predictionTracking: realTimeAnalysis,
          liveProbabilities: this.calculateLiveProbabilities(prediction, score),
          nextGoalLikelihood: this.predictNextGoal(score)
        };
      } else {
        // Match à venir - préparation
        const preMatchValidation = this.preparePreMatchValidation(prediction);
        
        return {
          matchStatus: 'à venir',
          scheduledTime: score.scheduledTime || prediction.dateTime || prediction.matchDateTime,
          predictionReadiness: preMatchValidation,
          aiConfidence: prediction.confidence || 50,
          keyFactors: prediction.aiAnalysis?.keyFactors || []
        };
      }
    } catch (error) {
      // Gestion d'erreur améliorée
      return {
        error: error.message,
        matchStatus: 'erreur',
        fallbackData: this.generateFallbackData(prediction),
        aiStatus: 'degraded',
        retryRecommended: true
      };
    }
  }

  validateWithAI(prediction, actualScore) {
    return {
      predictionMethod: prediction.aiVersion || 'standard',
      accuracyAssessment: this.assessAccuracy(prediction, actualScore),
      confidenceValidation: this.validateConfidence(prediction, actualScore),
      modelPerformance: this.evaluateModelPerformance(prediction, actualScore),
      improvementSuggestions: this.generateImprovementSuggestions(prediction, actualScore)
    };
  }

  analyzeRealTimeProgression(prediction, currentScore) {
    const predicted = prediction.predictedScore.split('-').map(Number);
    const current = currentScore.currentScore.split('-').map(Number);
    
    return {
      goalProgression: {
        predictedHome: predicted[0],
        predictedAway: predicted[1],
        currentHome: current[0],
        currentAway: current[1],
        progressionMatch: this.calculateProgressionMatch(predicted, current)
      },
      timeFactors: {
        minute: currentScore.minute,
        remainingTime: Math.max(0, 90 - (currentScore.minute || 0)),
        criticalPeriod: this.isCriticalPeriod(currentScore.minute)
      },
      predictionViability: this.assessPredictionViability(predicted, current, currentScore.minute)
    };
  }

  calculateLiveProbabilities(prediction, currentScore) {
    const timeRemaining = Math.max(0, 90 - (currentScore.minute || 0));
    const current = currentScore.currentScore.split('-').map(Number);
    const predicted = prediction.predictedScore.split('-').map(Number);
    
    // Algorithme simple de probabilité en temps réel
    const goalRate = 0.03; // 3% de chance de but par minute (simulation)
    
    return {
      exactMatchProbability: this.calculateExactMatchProbability(predicted, current, timeRemaining, goalRate),
      alternativeScenarios: this.calculateAlternativeProbabilities(predicted, current, timeRemaining),
      confidenceAdjustment: this.adjustLiveConfidence(prediction.confidence, current, predicted, timeRemaining)
    };
  }

  preparePreMatchValidation(prediction) {
    return {
      aiReadiness: prediction.aiVersion ? 'enhanced' : 'standard',
      dataQuality: this.assessDataQuality(prediction),
      factorsCovered: this.countAnalysisFactors(prediction),
      riskAssessment: prediction.riskLevel || 'medium',
      confidenceLevel: prediction.confidence || 50
    };
  }

  generateFallbackData(prediction) {
    return {
      basicPrediction: {
        homeTeam: prediction.homeTeam,
        awayTeam: prediction.awayTeam,
        predictedScore: prediction.predictedScore,
        confidence: prediction.confidence || 50
      },
      estimatedStatus: this.estimateMatchStatus(prediction),
      lastKnownUpdate: new Date().toISOString()
    };
  }

  // Fonctions utilitaires pour l'analyse avancée
  calculatePredictionAccuracy(prediction, actualScore) {
    const predicted = prediction.predictedScore.split('-').map(Number);
    const actual = actualScore.split('-').map(Number);
    
    const goalsDiff = Math.abs(predicted[0] - actual[0]) + Math.abs(predicted[1] - actual[1]);
    
    if (goalsDiff === 0) return 100;
    if (goalsDiff === 1) return 75;
    if (goalsDiff === 2) return 50;
    return Math.max(0, 25 - (goalsDiff * 5));
  }

  extractLearningData(prediction, score) {
    return {
      teamStrengths: {
        homePerformance: this.analyzeTeamPerformance(prediction.homeTeam, score),
        awayPerformance: this.analyzeTeamPerformance(prediction.awayTeam, score)
      },
      scoringPatterns: this.extractScoringPatterns(score),
      predictionFactors: this.identifyInfluentialFactors(prediction, score),
      timeStamp: new Date().toISOString()
    };
  }

  calculateProgressionMatch(predicted, current) {
    return {
      homeGoalsMatch: current[0] <= predicted[0],
      awayGoalsMatch: current[1] <= predicted[1],
      totalGoalsOnTrack: (current[0] + current[1]) <= (predicted[0] + predicted[1]),
      matchPercentage: this.calculateMatchPercentage(predicted, current)
    };
  }

  assessPredictionViability(predicted, current, minute) {
    const timeRemaining = Math.max(0, 90 - (minute || 0));
    const goalsNeeded = Math.max(0, (predicted[0] - current[0]) + (predicted[1] - current[1]));
    
    const viabilityScore = timeRemaining > 0 ? Math.min(100, (timeRemaining / goalsNeeded) * 20) : 0;
    
    return {
      score: viabilityScore,
      status: viabilityScore > 60 ? 'probable' : viabilityScore > 30 ? 'possible' : 'unlikely',
      goalsNeeded,
      timeRemaining
    };
  }

  isCriticalPeriod(minute) {
    return minute >= 80 || (minute >= 45 && minute <= 50) || (minute >= 15 && minute <= 25);
  }

  calculateExactMatchProbability(predicted, current, timeRemaining, goalRate) {
    const goalsNeededHome = Math.max(0, predicted[0] - current[0]);
    const goalsNeededAway = Math.max(0, predicted[1] - current[1]);
    
    // Simulation simplifiée de probabilité
    const homeProb = Math.pow(goalRate * timeRemaining, goalsNeededHome);
    const awayProb = Math.pow(goalRate * timeRemaining, goalsNeededAway);
    
    return Math.round(homeProb * awayProb * 100);
  }

  adjustLiveConfidence(originalConfidence, current, predicted, timeRemaining) {
    const progressionMatch = this.calculateProgressionMatch(predicted, current);
    const matchPercentage = progressionMatch.matchPercentage;
    
    const timeAdjustment = timeRemaining / 90;
    const progressAdjustment = matchPercentage / 100;
    
    const adjustedConfidence = originalConfidence * (0.5 + 0.5 * progressAdjustment) * (0.7 + 0.3 * timeAdjustment);
    
    return Math.round(Math.max(10, Math.min(95, adjustedConfidence)));
  }

  calculateMatchPercentage(predicted, current) {
    const totalPredicted = predicted[0] + predicted[1];
    const totalCurrent = current[0] + current[1];
    
    if (totalPredicted === 0) return current[0] === predicted[0] && current[1] === predicted[1] ? 100 : 0;
    
    const homeMatch = current[0] === predicted[0] ? 1 : Math.max(0, 1 - Math.abs(current[0] - predicted[0]) / Math.max(1, predicted[0]));
    const awayMatch = current[1] === predicted[1] ? 1 : Math.max(0, 1 - Math.abs(current[1] - predicted[1]) / Math.max(1, predicted[1]));
    
    return Math.round((homeMatch + awayMatch) * 50);
  }

  estimateMatchStatus(prediction) {
    const matchTime = new Date(prediction.dateTime || prediction.matchDateTime);
    const now = new Date();
    
    if (matchTime > now) return 'upcoming';
    if (now - matchTime < 2 * 60 * 60 * 1000) return 'possibly_live';
    return 'likely_finished';
  }

  predictNextGoal(score) {
    // Simulation basique de prédiction du prochain but
    const minute = score.minute || 45;
    const timeRemaining = Math.max(0, 90 - minute);
    
    const baseProb = 0.03 * timeRemaining; // 3% par minute restante
    
    return {
      probability: Math.round(Math.min(95, baseProb * 100)),
      likelyScorer: Math.random() > 0.5 ? 'home' : 'away',
      timeWindow: Math.round(timeRemaining * 0.3)
    };
  }
}

export const scoresService = new ScoresService();