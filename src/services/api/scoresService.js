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
        // Match terminé - analyse IA complète et apprentissage
        const comprehensiveAIValidation = this.performComprehensiveAIValidation(prediction, score);
        const accuracyAnalysis = this.performDetailedAccuracyAnalysis(prediction, score);
        
        return {
          actualScore: score.finalScore,
          correct: prediction.predictedScore === score.finalScore,
          matchStatus: 'terminé',
          confidence: prediction.confidence || 50,
          aiValidation: comprehensiveAIValidation,
          accuracyAnalysis: accuracyAnalysis,
          predictionAccuracy: this.calculateAdvancedPredictionAccuracy(prediction, score.finalScore),
          learningData: this.extractComprehensiveLearningData(prediction, score),
          performanceMetrics: this.calculatePerformanceMetrics(prediction, score),
          qualityAssessment: this.assessPredictionQuality(prediction, score),
          improvementInsights: this.generateImprovementInsights(prediction, score)
        };
      } else if (score.status === 'live' && score.currentScore) {
        // Match en cours - analyse temps réel sophistiquée
        const advancedRealTimeAnalysis = this.performAdvancedRealTimeAnalysis(prediction, score);
        const dynamicPredictionUpdates = this.calculateDynamicPredictionUpdates(prediction, score);
        
        return {
          currentScore: score.currentScore,
          matchStatus: 'en cours',
          minute: score.minute || 'N/A',
          predictionTracking: advancedRealTimeAnalysis,
          dynamicUpdates: dynamicPredictionUpdates,
          liveProbabilities: this.calculateAdvancedLiveProbabilities(prediction, score),
          nextGoalLikelihood: this.predictAdvancedNextGoal(score, prediction),
          realTimeOptimization: this.performRealTimeOptimization(prediction, score),
          adaptiveConfidence: this.calculateAdaptiveConfidence(prediction, score),
          criticalMoments: this.identifyCriticalMoments(score),
          predictionViability: this.assessLivePredictionViability(prediction, score)
        };
      } else {
        // Match à venir - préparation IA avancée
        const advancedPreMatchValidation = this.performAdvancedPreMatchValidation(prediction);
        const optimizationStatus = this.assessPreMatchOptimization(prediction);
        
        return {
          matchStatus: 'à venir',
          scheduledTime: score.scheduledTime || prediction.dateTime || prediction.matchDateTime,
          predictionReadiness: advancedPreMatchValidation,
          optimizationStatus: optimizationStatus,
          aiConfidence: prediction.confidence || 50,
          enhancedFactors: this.getEnhancedKeyFactors(prediction),
          realTimeFactors: prediction.realTimeFactors || {},
          algorithmStatus: this.getAlgorithmReadinessStatus(prediction),
          confidenceFactors: this.analyzeConfidenceFactors(prediction)
        };
      }
    } catch (error) {
      // Gestion d'erreur intelligente avec récupération
      const errorContext = this.analyzeError(error, prediction);
      const recoveryStrategy = this.generateRecoveryStrategy(error, prediction);
      
      return {
        error: error.message,
        matchStatus: 'erreur',
        errorContext: errorContext,
        recoveryStrategy: recoveryStrategy,
        fallbackData: this.generateIntelligentFallbackData(prediction),
        aiStatus: 'degraded',
        retryRecommended: true,
        alternativeApproaches: this.suggestAlternativeApproaches(error, prediction)
      };
    }
  }

  performComprehensiveAIValidation(prediction, actualScore) {
    const baseValidation = this.validateWithAI(prediction, actualScore);
    
    return {
      ...baseValidation,
      algorithmBreakdown: this.validateIndividualAlgorithms(prediction, actualScore),
      confidenceValidation: this.performAdvancedConfidenceValidation(prediction, actualScore),
      realTimeFactorValidation: this.validateRealTimeFactors(prediction, actualScore),
      patternMatchingValidation: this.validatePatternMatching(prediction, actualScore),
      learningEffectiveness: this.assessLearningEffectiveness(prediction, actualScore),
      predictionEvolution: this.analyzePredictionEvolution(prediction, actualScore)
    };
  }

  performAdvancedRealTimeAnalysis(prediction, currentScore) {
    const baseAnalysis = this.analyzeRealTimeProgression(prediction, currentScore);
    const minute = currentScore.minute || 0;
    const current = currentScore.currentScore.split('-').map(Number);
    
    return {
      ...baseAnalysis,
      advancedProgression: this.analyzeAdvancedProgression(prediction, current, minute),
      momentumAnalysis: this.analyzeMomentum(currentScore),
      adaptiveStrategy: this.calculateAdaptiveStrategy(prediction, currentScore),
      predictionRecalibration: this.recalibratePrediction(prediction, currentScore),
      riskAssessment: this.assessRealTimeRisk(prediction, currentScore),
      opportunityIdentification: this.identifyRealTimeOpportunities(prediction, currentScore)
    };
  }

  calculateDynamicPredictionUpdates(prediction, score) {
    const timeRemaining = Math.max(0, 90 - (score.minute || 0));
    const current = score.currentScore.split('-').map(Number);
    const predicted = prediction.predictedScore.split('-').map(Number);
    
    return {
      updatedPrediction: this.calculateUpdatedPrediction(predicted, current, timeRemaining),
      probabilityShifts: this.calculateProbabilityShifts(prediction, score),
      confidenceAdjustments: this.calculateDynamicConfidenceAdjustments(prediction, score),
      alternativeScenarios: this.updateAlternativeScenarios(predicted, current, timeRemaining),
      riskFactors: this.identifyDynamicRiskFactors(prediction, score),
      optimizationSuggestions: this.generateOptimizationSuggestions(prediction, score)
    };
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
    const minute = currentScore.minute || 0;
    
    return {
      goalProgression: {
        predictedHome: predicted[0],
        predictedAway: predicted[1],
        currentHome: current[0],
        currentAway: current[1],
        progressionMatch: this.calculateAdvancedProgressionMatch(predicted, current, minute),
        expectedProgression: this.calculateExpectedProgression(predicted, minute),
        progressionDeviation: this.calculateProgressionDeviation(predicted, current, minute)
      },
      timeFactors: {
        minute: minute,
        remainingTime: Math.max(0, 90 - minute),
        criticalPeriod: this.isCriticalPeriod(minute),
        matchPhase: this.determineMatchPhase(minute),
        intensityLevel: this.calculateMatchIntensity(minute, current),
        keyTimeWindows: this.identifyKeyTimeWindows(minute)
      },
      predictionViability: this.assessAdvancedPredictionViability(predicted, current, minute),
      adaptiveFactors: this.calculateAdaptiveFactors(prediction, currentScore),
      realTimeInsights: this.generateRealTimeInsights(prediction, currentScore)
    };
  }

  calculateAdvancedLiveProbabilities(prediction, currentScore) {
    const timeRemaining = Math.max(0, 90 - (currentScore.minute || 0));
    const current = currentScore.currentScore.split('-').map(Number);
    const predicted = prediction.predictedScore.split('-').map(Number);
    const minute = currentScore.minute || 0;
    
    // Algorithme avancé de probabilité avec facteurs multiples
    const dynamicGoalRate = this.calculateDynamicGoalRate(minute, current);
    const momentumFactor = this.calculateMomentumFactor(currentScore);
    const contextualFactors = this.getContextualFactors(prediction, currentScore);
    
    return {
      exactMatchProbability: this.calculateAdvancedExactMatchProbability(
        predicted, current, timeRemaining, dynamicGoalRate, momentumFactor
      ),
      alternativeScenarios: this.calculateAdvancedAlternativeProbabilities(
        predicted, current, timeRemaining, contextualFactors
      ),
      confidenceAdjustment: this.calculateAdvancedLiveConfidence(
        prediction.confidence, current, predicted, timeRemaining, momentumFactor
      ),
      probabilityEvolution: this.trackProbabilityEvolution(prediction, currentScore),
      riskAssessment: this.assessLiveRiskFactors(predicted, current, timeRemaining),
      opportunityWindows: this.identifyOpportunityWindows(currentScore, predicted)
    };
  }

  calculateDynamicGoalRate(minute, currentScore) {
    // Taux de buts adaptatif selon la phase du match et le score
    const baseRate = 0.03;
    const phaseMultiplier = this.getPhaseMultiplier(minute);
    const scoreInfluence = this.getScoreInfluence(currentScore);
    
    return baseRate * phaseMultiplier * scoreInfluence;
  }

  calculateAdvancedExactMatchProbability(predicted, current, timeRemaining, goalRate, momentum) {
    const goalsNeededHome = Math.max(0, predicted[0] - current[0]);
    const goalsNeededAway = Math.max(0, predicted[1] - current[1]);
    
    // Probabilité basée sur distribution de Poisson modifiée
    const homeProbability = this.calculatePoissonProbability(goalsNeededHome, goalRate * timeRemaining * momentum.home);
    const awayProbability = this.calculatePoissonProbability(goalsNeededAway, goalRate * timeRemaining * momentum.away);
    
    // Facteur d'interdépendance des événements
    const interdependenceFactor = this.calculateInterdependenceFactor(goalsNeededHome, goalsNeededAway);
    
    const finalProbability = homeProbability * awayProbability * interdependenceFactor;
    return Math.round(Math.min(95, Math.max(1, finalProbability * 100)));
  }

  calculatePoissonProbability(k, lambda) {
    // Approximation de la distribution de Poisson
    if (lambda === 0) return k === 0 ? 1 : 0;
    
    const e = Math.E;
    let probability = Math.pow(e, -lambda);
    
    for (let i = 1; i <= k; i++) {
      probability *= lambda / i;
    }
    
    return Math.min(1, probability);
  }

  performRealTimeOptimization(prediction, score) {
    const current = score.currentScore.split('-').map(Number);
    const predicted = prediction.predictedScore.split('-').map(Number);
    const minute = score.minute || 0;
    
    return {
      optimizedPrediction: this.calculateOptimizedPrediction(predicted, current, minute),
      adaptiveStrategy: this.generateAdaptiveStrategy(prediction, score),
      realTimeAdjustments: this.calculateRealTimeAdjustments(prediction, score),
      performanceOptimization: this.optimizePerformanceMetrics(prediction, score),
      learningOptimization: this.optimizeLearningFromRealTime(prediction, score)
    };
  }

  assessLivePredictionViability(prediction, score) {
    const current = score.currentScore.split('-').map(Number);
    const predicted = prediction.predictedScore.split('-').map(Number);
    const timeRemaining = Math.max(0, 90 - (score.minute || 0));
    
    const viabilityScore = this.calculateViabilityScore(predicted, current, timeRemaining);
    const confidenceAdjustment = this.calculateViabilityBasedConfidence(prediction, viabilityScore);
    
    return {
      viabilityScore: viabilityScore,
      viabilityLevel: this.determineViabilityLevel(viabilityScore),
      adjustedConfidence: confidenceAdjustment,
      criticalFactors: this.identifyCriticalViabilityFactors(prediction, score),
      contingencyPlans: this.generateViabilityContingencyPlans(prediction, score),
      recommendedActions: this.recommendViabilityActions(viabilityScore, prediction)
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
    
    // Algorithme avancé de probabilité avec facteurs contextuels
    const contextualGoalRate = this.calculateContextualGoalRate(goalRate, current, timeRemaining);
    const homeProb = this.calculateAdvancedGoalProbability(goalsNeededHome, contextualGoalRate.home, timeRemaining);
    const awayProb = this.calculateAdvancedGoalProbability(goalsNeededAway, contextualGoalRate.away, timeRemaining);
    
    // Facteur de corrélation entre les équipes
    const correlationFactor = this.calculateTeamCorrelationFactor(predicted, current, timeRemaining);
    
    const finalProbability = homeProb * awayProb * correlationFactor;
    return Math.round(Math.min(95, Math.max(1, finalProbability * 100)));
  }

  calculateAdvancedGoalProbability(goalsNeeded, adjustedGoalRate, timeRemaining) {
    if (goalsNeeded === 0) return 1;
    if (timeRemaining === 0) return 0;
    
    // Utilisation d'une distribution de Poisson modifiée
    const lambda = adjustedGoalRate * timeRemaining;
    return this.calculatePoissonProbability(goalsNeeded, lambda);
  }

  calculateContextualGoalRate(baseRate, currentScore, timeRemaining) {
    const minute = 90 - timeRemaining;
    const scoreDifference = Math.abs(currentScore[0] - currentScore[1]);
    
    // Ajustement selon la phase du match
    let phaseMultiplier = 1.0;
    if (minute < 15 || minute > 75) phaseMultiplier = 1.2; // Début et fin plus intenses
    if (minute >= 45 && minute <= 50) phaseMultiplier = 0.8; // Mi-temps moins intense
    
    // Ajustement selon l'écart au score
    let scoreMultiplier = 1.0;
    if (scoreDifference >= 2) scoreMultiplier = 0.7; // Match déséquilibré
    if (scoreDifference === 0 && minute > 70) scoreMultiplier = 1.3; // Fin de match équilibré
    
    return {
      home: baseRate * phaseMultiplier * scoreMultiplier * (scoreDifference === 0 ? 1 : (currentScore[0] < currentScore[1] ? 1.2 : 0.9)),
      away: baseRate * phaseMultiplier * scoreMultiplier * (scoreDifference === 0 ? 1 : (currentScore[1] < currentScore[0] ? 1.2 : 0.9))
    };
  }

  adjustLiveConfidence(originalConfidence, current, predicted, timeRemaining) {
    const progressionMatch = this.calculateAdvancedProgressionMatch(predicted, current, 90 - timeRemaining);
    const matchPercentage = progressionMatch.matchPercentage;
    
    // Facteurs d'ajustement multiples
    const timeAdjustment = this.calculateTimeBasedAdjustment(timeRemaining);
    const progressAdjustment = this.calculateProgressBasedAdjustment(matchPercentage);
    const contextAdjustment = this.calculateContextualAdjustment(current, predicted, timeRemaining);
    
    const adjustedConfidence = originalConfidence * 
      (0.4 + 0.6 * progressAdjustment) * 
      (0.6 + 0.4 * timeAdjustment) * 
      contextAdjustment;
    
    return Math.round(Math.max(5, Math.min(95, adjustedConfidence)));
  }

  calculateAdvancedProgressionMatch(predicted, current, minute) {
    const expectedProgression = this.calculateExpectedProgression(predicted, minute);
    
    // Comparaison entre progression attendue et réelle
    const homeProgression = this.calculateProgressionAccuracy(expectedProgression[0], current[0]);
    const awayProgression = this.calculateProgressionAccuracy(expectedProgression[1], current[1]);
    
    const overallMatch = (homeProgression + awayProgression) / 2;
    
    return {
      matchPercentage: Math.round(overallMatch * 100),
      homeProgression: homeProgression,
      awayProgression: awayProgression,
      expectedProgression: expectedProgression,
      progressionTrend: this.calculateProgressionTrend(predicted, current, minute)
    };
  }

  calculateExpectedProgression(predicted, minute) {
    // Distribution temporelle des buts basée sur des patterns réalistes
    const progressionCurve = this.getProgressionCurve(minute);
    
    return [
      predicted[0] * progressionCurve,
      predicted[1] * progressionCurve
    ];
  }

  getProgressionCurve(minute) {
    // Courbe de progression réaliste des buts
    if (minute <= 15) return 0.1; // 10% des buts en début
    if (minute <= 30) return 0.25; // 25% à 30 minutes
    if (minute <= 45) return 0.4; // 40% à la mi-temps
    if (minute <= 60) return 0.6; // 60% à l'heure de jeu
    if (minute <= 75) return 0.8; // 80% aux trois quarts
    return 1.0; // 100% en fin de match
  }

  calculateProgressionAccuracy(expected, actual) {
    const difference = Math.abs(expected - actual);
    const maxExpected = Math.max(1, expected);
    
    return Math.max(0, 1 - (difference / maxExpected));
  }

  calculateTimeBasedAdjustment(timeRemaining) {
    // Ajustement non-linéaire basé sur le temps restant
    const timeRatio = timeRemaining / 90;
    
    if (timeRatio > 0.8) return 0.7; // Début de match - moins fiable
    if (timeRatio > 0.5) return 0.9; // Mi-match - modérément fiable
    if (timeRatio > 0.2) return 1.1; // Fin de match - plus fiable
    return 1.2; // Toute fin - très fiable
  }

  calculateProgressBasedAdjustment(matchPercentage) {
    // Ajustement basé sur la correspondance de progression
    return 0.5 + (matchPercentage / 100) * 0.5;
  }

  calculateContextualAdjustment(current, predicted, timeRemaining) {
    const currentTotal = current[0] + current[1];
    const predictedTotal = predicted[0] + predicted[1];
    const scoreDifference = Math.abs(current[0] - current[1]);
    
    let adjustment = 1.0;
    
    // Ajustement selon le nombre de buts
    if (currentTotal > predictedTotal) adjustment *= 0.9; // Plus de buts que prévu
    if (currentTotal < predictedTotal * 0.5 && timeRemaining < 30) adjustment *= 0.8; // Trop peu de buts en fin
    
    // Ajustement selon l'équilibre du match
    if (scoreDifference >= 3) adjustment *= 0.7; // Match très déséquilibré
    
    return adjustment;
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