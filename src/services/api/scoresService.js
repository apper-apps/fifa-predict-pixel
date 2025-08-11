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
        // Match terminé - analyse IA complète pour scores diversifiés avec mi-temps
        const comprehensiveAIValidation = this.performComprehensiveAIValidation(prediction, score);
        const accuracyAnalysis = this.performDetailedAccuracyAnalysis(prediction, score);
        const extremeScoreAnalysis = this.analyzeExtremeScoreResult(prediction, score.finalScore);
        const halftimeScoreAnalysis = score.halftimeScore ? this.analyzeHalftimeScoreAccuracy(prediction, score) : null;
        
// Analyse complète des 4 scores mi-temps exacts
        const exactHalftimeAnalysis = this.analyzeExactHalftimeScores(prediction, score);
        const halftimeScoreAccuracy = score.halftimeScore ? this.calculateHalftimeAccuracy(prediction.predictedHalftimeScore, score.halftimeScore) : null;
        
        return {
          actualScore: score.finalScore,
          actualHalftimeScore: score.halftimeScore,
          actualWinner: this.determineWinner(score.finalScore),
          actualHalftimeWinner: score.halftimeScore ? this.determineWinner(score.halftimeScore) : null,
          correct: prediction.predictedScore === score.finalScore,
          halftimeCorrect: exactHalftimeAnalysis?.exactMatch || false,
          halftimeAccuracy: halftimeScoreAccuracy,
          exactHalftimeMatch: exactHalftimeAnalysis?.exactMatch,
          matchStatus: 'terminé',
          timestamp: new Date().toISOString(),
          matchTime: this.getExactMatchTime(prediction),
          confidence: prediction.confidence || 50,
          aiValidation: comprehensiveAIValidation,
          accuracyAnalysis: accuracyAnalysis,
          extremeScoreAnalysis: extremeScoreAnalysis,
          halftimeScoreAnalysis: exactHalftimeAnalysis,
          predictionAccuracy: this.calculateAdvancedPredictionAccuracy(prediction, score.finalScore),
          learningData: this.extractComprehensiveLearningData(prediction, score),
          performanceMetrics: this.calculatePerformanceMetrics(prediction, score),
          qualityAssessment: this.assessAdvancedPredictionQuality(prediction, score),
          improvementInsights: this.generateImprovementInsights(prediction, score),
          scoreTypeAccuracy: this.assessScoreTypeAccuracy(prediction, score.finalScore),
          diverseScoreLearning: this.extractDiverseScoreLearning(prediction, score.finalScore),
          fourScoreExactIntegration: exactHalftimeAnalysis?.fourScoreAnalysis || 'N/A'
        };
      } else if (score.status === 'live' && score.currentScore) {
        // Match en cours - temps réel avec suivi mi-temps et 4 scores exacts
        const currentMatchTime = new Date().toISOString();
        const currentMinute = score.minute || this.estimateCurrentMinute(prediction);
        const advancedRealTimeAnalysis = this.performAdvancedRealTimeAnalysis(prediction, score);
        const dynamicPredictionUpdates = this.calculateDynamicPredictionUpdates(prediction, score);
        const extremeScoreProjection = this.calculateExtremeScoreProjection(prediction, score);
        const halftimeTrackingAnalysis = this.analyzeHalftimeProgression(prediction, score);
        const realTimeHalftimePredictions = this.generateRealTimeHalftimePredictions(prediction, score);
        
        return {
          currentScore: score.currentScore,
          currentWinner: this.determineWinner(score.currentScore),
          actualHalftimeScore: currentMinute >= 45 ? score.currentScore : null,
          matchStatus: 'en_cours',
          minute: currentMinute,
          currentTime: currentMatchTime,
          scheduledTime: this.getExactMatchTime(prediction),
          timestamp: currentMatchTime,
          predictionTracking: advancedRealTimeAnalysis,
          dynamicUpdates: dynamicPredictionUpdates,
          extremeScoreProjection: extremeScoreProjection,
          halftimeTracking: halftimeTrackingAnalysis,
          liveProbabilities: this.calculateAdvancedLiveProbabilities(prediction, score),
          nextGoalLikelihood: this.predictAdvancedNextGoal(score, prediction),
          realTimeOptimization: this.performRealTimeOptimization(prediction, score),
          adaptiveConfidence: this.calculateAdaptiveConfidence(prediction, score),
          criticalMoments: this.identifyCriticalMoments(score),
          predictionViability: this.assessLivePredictionViability(prediction, score),
          highScoringPotential: this.assessHighScoringPotential(score, prediction),
          realTimePredictions: realTimeHalftimePredictions,
          liveHalftimeAnalysis: currentMinute >= 45 ? this.analyzeCurrentHalftime(prediction, score) : null,
          fourScoreLiveTracking: this.trackFourScoreExactLive(prediction, score)
        };
      } else {
        // Match à venir - préparation avec heures exactes et 4 scores mi-temps
        const scheduledDateTime = this.getExactMatchTime(prediction);
        const timeUntilKickoff = this.calculateTimeUntilKickoff(scheduledDateTime);
        const advancedPreMatchValidation = this.performAdvancedPreMatchValidation(prediction);
        const optimizationStatus = this.assessPreMatchOptimization(prediction);
        const extremeScorePotential = this.assessExtremeScorePotential(prediction);
        const fourScoreReadiness = this.assessFourScoreHalftimeReadiness(prediction);
        
        return {
          matchStatus: 'à venir',
          scheduledTime: scheduledDateTime,
          timeUntilKickoff: timeUntilKickoff,
          countdownDisplay: this.formatCountdown(timeUntilKickoff),
          timestamp: new Date().toISOString(),
          predictionReadiness: advancedPreMatchValidation,
          optimizationStatus: optimizationStatus,
          extremeScorePotential: extremeScorePotential,
          aiConfidence: prediction.confidence || 50,
          halftimeConfidence: prediction.halftimeConfidence || 0,
          enhancedFactors: this.getEnhancedKeyFactors(prediction),
          realTimeFactors: prediction.realTimeFactors || {},
          algorithmStatus: this.getAlgorithmReadinessStatus(prediction),
          confidenceFactors: this.analyzeConfidenceFactors(prediction),
          scoreRangeCapability: prediction.scoreRangeCapability || 'enhanced_with_4_halftime_scores',
          fourScoreHalftimeStatus: fourScoreReadiness,
          halftimeSupport: {
            enabled: !!prediction.predictedHalftimeScore,
            exactScores: 4,
            confidence: prediction.halftimeConfidence,
            algorithm: 'genetic_enhanced'
          }
        };
      }
    } catch (error) {
      // Gestion d'erreur avec informations temporelles précises
      const currentTime = new Date().toISOString();
      const errorContext = this.analyzeError(error, prediction);
      const recoveryStrategy = this.generateRecoveryStrategy(error, prediction);
      
      return {
        error: error.message,
        matchStatus: 'erreur',
        timestamp: currentTime,
        scheduledTime: prediction ? this.getExactMatchTime(prediction) : null,
        errorContext: errorContext,
        recoveryStrategy: recoveryStrategy,
        fallbackData: this.generateIntelligentFallbackData(prediction),
        aiStatus: 'degraded',
        retryRecommended: true,
        alternativeApproaches: this.suggestAlternativeApproaches(error, prediction),
        errorTime: currentTime
      };
    }
  }

  analyzeHalftimeScoreAccuracy(prediction, score) {
    const predictedHalftime = prediction.expectedHalftimeScore || prediction.predictedHalftimeScore;
    const actualHalftime = score.halftimeScore;
    
    if (!predictedHalftime || !actualHalftime) {
      return { exactMatch: false, accuracy: 0, analysis: 'Données mi-temps incomplètes' };
    }

    const exactMatch = predictedHalftime === actualHalftime;
    const accuracy = this.calculateHalftimeAccuracy(predictedHalftime, actualHalftime);
    
    return {
      exactMatch: exactMatch,
      accuracy: accuracy,
      predictedHalftime: predictedHalftime,
      actualHalftime: actualHalftime,
      analysis: exactMatch ? 'Prédiction mi-temps exacte' : `Écart mi-temps: ${Math.abs(accuracy - 100)}%`
    };
  }

  calculateHalftimeAccuracy(predicted, actual) {
    const predGoals = predicted.split('-').map(Number);
    const actualGoals = actual.split('-').map(Number);
    
    const goalsDiff = Math.abs(predGoals[0] - actualGoals[0]) + Math.abs(predGoals[1] - actualGoals[1]);
    
    if (goalsDiff === 0) return 100;
    if (goalsDiff === 1) return 85;
    if (goalsDiff === 2) return 65;
    if (goalsDiff === 3) return 40;
    return Math.max(10, 35 - (goalsDiff * 5));
  }

  analyzeHalftimeProgression(prediction, score) {
    const minute = score.minute || 0;
    const isFirstHalf = minute <= 45;
    const actualHalftime = score.halftimeScore;
    const predictedHalftime = prediction.expectedHalftimeScore;

    return {
      phase: isFirstHalf ? 'première_mi_temps' : 'seconde_mi_temps',
      minute: minute,
      halftimeScoreAvailable: Boolean(actualHalftime),
      halftimeAccuracy: actualHalftime && predictedHalftime ? 
        this.calculateHalftimeAccuracy(predictedHalftime, actualHalftime) : null,
      halftimeComparison: this.compareHalftimeScores(predictedHalftime, actualHalftime),
      progression: this.calculateHalftimeProgression(score.currentScore, actualHalftime, minute)
    };
  }

  compareHalftimeScores(predicted, actual) {
    if (!predicted || !actual) return null;
    
    return {
      predicted: predicted,
      actual: actual,
      match: predicted === actual,
      difference: this.calculateScoreDifference(predicted, actual)
    };
  }

  calculateHalftimeProgression(currentScore, halftimeScore, minute) {
    if (!halftimeScore) return null;
    
    const current = currentScore.split('-').map(Number);
    const halftime = halftimeScore.split('-').map(Number);
    
    return {
      secondHalfGoals: [current[0] - halftime[0], current[1] - halftime[1]],
      progressionRate: minute > 45 ? ((current[0] + current[1] - halftime[0] - halftime[1]) / (minute - 45)) * 45 : 0,
      isOnTrack: true
    };
  }

  generateRealTimeHalftimePredictions(prediction, score) {
    const minute = score.minute || 0;
    const currentHalftime = score.halftimeScore;
    const predictedHalftime = prediction.expectedHalftimeScore;

    return {
      adjustedPrediction: this.adjustPredictionBasedOnHalftime(prediction, score),
      halftimeStatus: currentHalftime ? 'confirmé' : 'en_attente',
      confidenceAdjustment: this.calculateHalftimeConfidenceAdjustment(prediction, score),
      nextHalfPrediction: minute > 45 ? this.predictSecondHalfOutcome(prediction, score) : null
    };
  }

  adjustPredictionBasedOnHalftime(prediction, score) {
    if (!score.halftimeScore) return prediction.predictedScore;
    
    // Logique d'ajustement basée sur le score de mi-temps réel
    const halftime = score.halftimeScore.split('-').map(Number);
    const predicted = prediction.predictedScore.split('-').map(Number);
    
    // Ajustement simple: si mi-temps différente, ajuster proportionnellement
    const adjustment = this.calculateSecondHalfAdjustment(halftime, predicted);
    
    return `${adjustment[0]}-${adjustment[1]}`;
  }

  calculateSecondHalfAdjustment(halftime, predicted) {
    // Estimer les buts de seconde mi-temps en fonction de la première
    const predictedSecondHalf = [predicted[0] - halftime[0], predicted[1] - halftime[1]];
    
    // Assurer que les buts de seconde mi-temps ne soient pas négatifs
    const adjustedSecondHalf = [
      Math.max(0, predictedSecondHalf[0]),
      Math.max(0, predictedSecondHalf[1])
    ];
    
    return [halftime[0] + adjustedSecondHalf[0], halftime[1] + adjustedSecondHalf[1]];
  }

  calculateHalftimeConfidenceAdjustment(prediction, score) {
    const baseConfidence = prediction.confidence || 50;
    const halftimeAccuracy = score.halftimeScore && prediction.expectedHalftimeScore ?
      this.calculateHalftimeAccuracy(prediction.expectedHalftimeScore, score.halftimeScore) : 50;
    
    // Ajuster la confiance basée sur la précision de mi-temps
    const adjustment = (halftimeAccuracy - 50) * 0.3; // Facteur d'impact de 30%
    
    return Math.round(Math.max(10, Math.min(95, baseConfidence + adjustment)));
  }

  getExactMatchTime(prediction) {
    const dateTime = prediction.dateTime || prediction.matchDateTime;
    if (!dateTime) return null;
    
    // Retourner l'heure exacte formatée
    return new Date(dateTime).toISOString();
  }

  calculateTimeUntilKickoff(scheduledTime) {
    if (!scheduledTime) return null;
    
    const now = new Date();
    const kickoff = new Date(scheduledTime);
    const diffMs = kickoff - now;
    
    if (diffMs < 0) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, totalMinutes: Math.floor(diffMs / (1000 * 60)) };
  }

  predictSecondHalfOutcome(prediction, score) {
    const halftime = score.halftimeScore.split('-').map(Number);
    const predicted = prediction.predictedScore.split('-').map(Number);
    
    return {
      expectedSecondHalfGoals: [
        Math.max(0, predicted[0] - halftime[0]),
        Math.max(0, predicted[1] - halftime[1])
      ],
      probability: this.calculateSecondHalfProbability(halftime, predicted),
      riskLevel: this.assessSecondHalfRisk(halftime, predicted)
    };
  }

  calculateSecondHalfProbability(halftime, predicted) {
    const goalsNeeded = Math.max(0, (predicted[0] + predicted[1]) - (halftime[0] + halftime[1]));
    const timeRemaining = 45; // Minutes restantes en seconde mi-temps
    
    // Probabilité basée sur le nombre de buts nécessaires et le temps restant
    return Math.round(Math.max(10, Math.min(90, 80 - (goalsNeeded * 15))));
  }

  assessSecondHalfRisk(halftime, predicted) {
    const goalsNeeded = Math.max(0, (predicted[0] + predicted[1]) - (halftime[0] + halftime[1]));
    
    if (goalsNeeded === 0) return 'très_faible';
    if (goalsNeeded <= 2) return 'faible';
    if (goalsNeeded <= 4) return 'moyen';
    return 'élevé';
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
    
    // Algorithme avancé de probabilité avec support pour scores diversifiés
    const dynamicGoalRate = this.calculateAdvancedDynamicGoalRate(minute, current);
    const momentumFactor = this.calculateMomentumFactor(currentScore);
    const contextualFactors = this.getContextualFactors(prediction, currentScore);
    const extremeScoreFactors = this.calculateExtremeScoreFactors(current, predicted, timeRemaining);
    
    return {
      exactMatchProbability: this.calculateAdvancedExactMatchProbability(
        predicted, current, timeRemaining, dynamicGoalRate, momentumFactor
      ),
      alternativeScenarios: this.calculateAdvancedAlternativeProbabilities(
        predicted, current, timeRemaining, contextualFactors
      ),
      extremeScenarios: this.calculateExtremeScenarioProbabilities(
        predicted, current, timeRemaining, extremeScoreFactors
      ),
      confidenceAdjustment: this.calculateAdvancedLiveConfidence(
        prediction.confidence, current, predicted, timeRemaining, momentumFactor
      ),
      probabilityEvolution: this.trackProbabilityEvolution(prediction, currentScore),
      riskAssessment: this.assessLiveRiskFactors(predicted, current, timeRemaining),
      opportunityWindows: this.identifyOpportunityWindows(currentScore, predicted),
      highScoringProbability: this.calculateHighScoringProbability(current, timeRemaining),
      extremeScoreProbability: extremeScoreFactors.probability
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
calculateAdvancedPredictionAccuracy(prediction, actualScore) {
    const predicted = prediction.predictedScore.split('-').map(Number);
    const actual = actualScore.split('-').map(Number);
    
    const goalsDiff = Math.abs(predicted[0] - actual[0]) + Math.abs(predicted[1] - actual[1]);
    const totalGoalsPredicted = predicted[0] + predicted[1];
    const totalGoalsActual = actual[0] + actual[1];
    const totalGoalsDiff = Math.abs(totalGoalsPredicted - totalGoalsActual);
    
    // Calcul de précision avec bonus pour scores extrêmes
    let accuracy = 0;
    if (goalsDiff === 0) accuracy = 100; // Score exact
    else if (goalsDiff === 1) accuracy = 80; // Très proche
    else if (goalsDiff === 2) accuracy = 65; // Proche
    else if (goalsDiff === 3) accuracy = 45; // Acceptable
    else if (goalsDiff === 4) accuracy = 30; // Moyen
    else accuracy = Math.max(5, 25 - (goalsDiff * 3));
    
    // Bonus pour prédiction correcte de score extrême
    if (this.isExtremeScore(actualScore) && this.isExtremeScore(prediction.predictedScore)) {
      accuracy += 15;
    }
    
    // Bonus pour prédiction correcte du type de match
    if (totalGoalsDiff <= 1) {
      accuracy += 5;
    }
    
    return Math.min(100, accuracy);
  }

  isExtremeScore(score) {
    const [home, away] = score.split('-').map(Number);
    return home >= 4 || away >= 4 || (home + away) >= 6;
  }

  analyzeExtremeScoreResult(prediction, actualScore) {
    const isActualExtreme = this.isExtremeScore(actualScore);
    const isPredictedExtreme = this.isExtremeScore(prediction.predictedScore);
    
    return {
      actualWasExtreme: isActualExtreme,
      predictedAsExtreme: isPredictedExtreme,
      extremeScoreDetectionAccuracy: isActualExtreme === isPredictedExtreme,
      learningValue: isActualExtreme ? 'very_high' : 'standard',
      scoreCategoryMatch: this.categorizeScore(actualScore) === this.categorizeScore(prediction.predictedScore)
    };
  }

  categorizeScore(score) {
    const [home, away] = score.split('-').map(Number);
    const total = home + away;
    
    if (home >= 5 || away >= 5) return 'extreme';
    if (total >= 5) return 'high_scoring';
    if (total <= 2) return 'low_scoring';
    return 'normal';
  }

  calculateExtremeScoreProjection(prediction, currentScore) {
    const current = currentScore.currentScore.split('-').map(Number);
    const currentTotal = current[0] + current[1];
    const minute = currentScore.minute || 0;
    const timeRemaining = Math.max(0, 90 - minute);
    
    // Projection pour score extrême basée sur le rythme actuel
    const goalRate = currentTotal / Math.max(1, minute);
    const projectedFinalGoals = goalRate * 90;
    
    const extremeProbability = Math.min(0.95, Math.max(0.05, 
      (projectedFinalGoals >= 6 ? 0.7 : 0.2) +
      (currentTotal >= 4 ? 0.3 : 0) +
      (timeRemaining > 30 && goalRate > 0.06 ? 0.4 : 0)
    ));
    
    return {
      probability: Math.round(extremeProbability * 100),
      projectedFinalScore: this.projectFinalScore(current, goalRate, timeRemaining),
      confidenceLevel: extremeProbability > 0.6 ? 'high' : extremeProbability > 0.3 ? 'medium' : 'low',
      keyIndicators: {
        currentGoalRate: Math.round(goalRate * 1000) / 1000,
        projectedTotalGoals: Math.round(projectedFinalGoals * 10) / 10,
        timeRemaining: timeRemaining
      }
    };
  }

  projectFinalScore(current, goalRate, timeRemaining) {
    const additionalGoalsHome = Math.round((goalRate * timeRemaining) * (current[0] / Math.max(1, current[0] + current[1])));
    const additionalGoalsAway = Math.round((goalRate * timeRemaining) * (current[1] / Math.max(1, current[0] + current[1])));
    
    const finalHome = Math.min(8, current[0] + additionalGoalsHome);
    const finalAway = Math.min(8, current[1] + additionalGoalsAway);
    
    return `${finalHome}-${finalAway}`;
  }

  calculateAdvancedDynamicGoalRate(minute, currentScore) {
    // Taux de buts adaptatif avec support pour scores élevés
    const baseRate = 0.033; // Légèrement plus élevé pour permettre scores plus hauts
    const currentTotal = currentScore[0] + currentScore[1];
    
    // Multiplicateur basé sur la phase du match
    let phaseMultiplier = 1.0;
    if (minute < 15 || minute > 75) phaseMultiplier = 1.3; // Phases plus intenses
    if (minute >= 45 && minute <= 50) phaseMultiplier = 0.7; // Mi-temps
    if (minute >= 60 && minute <= 75) phaseMultiplier = 1.2; // Fin de match
    
    // Multiplicateur basé sur le score actuel
    let scoreMultiplier = 1.0;
    if (currentTotal >= 4) scoreMultiplier = 1.1; // Match déjà riche en buts
    if (currentTotal >= 6) scoreMultiplier = 1.2; // Match très offensif
    if (currentTotal <= 1 && minute > 60) scoreMultiplier = 1.3; // Urgence en fin de match
    
    return baseRate * phaseMultiplier * scoreMultiplier;
  }

  calculateExtremeScoreFactors(current, predicted, timeRemaining) {
    const currentIsHigh = (current[0] + current[1]) >= 4;
    const predictedIsHigh = (predicted[0] + predicted[1]) >= 4;
    const maxGoalsCurrent = Math.max(current[0], current[1]);
    const maxGoalsPredicted = Math.max(predicted[0], predicted[1]);
    
    let probability = 0.1; // Probabilité de base
    
    if (currentIsHigh) probability += 0.3;
    if (predictedIsHigh) probability += 0.2;
    if (maxGoalsCurrent >= 3) probability += 0.25;
    if (maxGoalsPredicted >= 3) probability += 0.15;
    if (timeRemaining > 30) probability += 0.1;
    
    return {
      probability: Math.min(0.9, probability),
      factors: {
        currentHighScoring: currentIsHigh,
        predictedHighScoring: predictedIsHigh,
        maxCurrentGoals: maxGoalsCurrent,
        timeAdvantage: timeRemaining > 30
      }
    };
  }

  calculateExtremeScenarioProbabilities(predicted, current, timeRemaining, extremeFactors) {
    const scenarios = [];
    
    // Génération de scénarios extrêmes possibles
    for (let h = Math.max(current[0], 4); h <= 7; h++) {
      for (let a = Math.max(current[1], 0); a <= 7; a++) {
        if (h >= 4 || a >= 4 || (h + a) >= 6) {
          const probability = this.calculateScenarioProbability(
            [h, a], current, timeRemaining, extremeFactors
          );
          
          if (probability > 0.05) {
            scenarios.push({
              score: `${h}-${a}`,
              probability: Math.round(probability * 100),
              likelihood: probability > 0.3 ? 'high' : probability > 0.15 ? 'medium' : 'low'
            });
          }
        }
      }
    }
    
    return scenarios.sort((a, b) => b.probability - a.probability).slice(0, 5);
  }

  calculateScenarioProbability(scenario, current, timeRemaining, extremeFactors) {
    const goalsNeededHome = Math.max(0, scenario[0] - current[0]);
    const goalsNeededAway = Math.max(0, scenario[1] - current[1]);
    const totalGoalsNeeded = goalsNeededHome + goalsNeededAway;
    
    if (totalGoalsNeeded === 0) return current[0] === scenario[0] && current[1] === scenario[1] ? 1 : 0;
    if (timeRemaining === 0) return 0;
    
    // Probabilité basée sur le temps restant et les facteurs extrêmes
    const baseProb = Math.pow(0.85, totalGoalsNeeded) * (timeRemaining / 90);
    const extremeBonus = extremeFactors.probability * 0.5;
    
    return Math.min(0.8, baseProb + extremeBonus);
  }

  calculateHighScoringProbability(current, timeRemaining) {
    const currentTotal = current[0] + current[1];
    const goalRate = currentTotal / Math.max(1, 90 - timeRemaining);
    const projectedTotal = goalRate * 90;
    
    return Math.min(0.95, Math.max(0.05, 
      (projectedTotal >= 5 ? 0.6 : 0.2) +
      (currentTotal >= 3 ? 0.3 : 0) +
      (timeRemaining > 20 ? 0.1 : 0)
    ));
  }

  assessHighScoringPotential(score, prediction) {
    const current = score.currentScore.split('-').map(Number);
    const predicted = prediction.predictedScore.split('-').map(Number);
    
    return {
      currentScoreIndicator: (current[0] + current[1]) >= 3 ? 'high' : 'normal',
      predictedScoreType: (predicted[0] + predicted[1]) >= 4 ? 'high_scoring' : 'normal',
      alignment: this.assessScoreAlignment(current, predicted),
      potential: this.calculateHighScoringProbability(current, Math.max(0, 90 - (score.minute || 0)))
    };
  }

  assessScoreAlignment(current, predicted) {
    const currentTotal = current[0] + current[1];
    const predictedTotal = predicted[0] + predicted[1];
    
    if (Math.abs(currentTotal - predictedTotal) <= 1) return 'excellent';
    if (Math.abs(currentTotal - predictedTotal) <= 2) return 'good';
    return 'moderate';
  }

  assessExtremeScorePotential(prediction) {
    const predicted = prediction.predictedScore.split('-').map(Number);
    const isExtremePredict = this.isExtremeScore(prediction.predictedScore);
    
    return {
      predictedAsExtreme: isExtremePredict,
      extremeConfidence: prediction.extremeScoreLikelihood || 0,
      scoreRange: `0-7 goals per team`,
      capability: prediction.scoreRangeCapability || 'enhanced',
      algorithms: prediction.algorithmBreakdown?.length || 7
    };
  }

  assessScoreTypeAccuracy(prediction, actualScore) {
    const predictedCategory = this.categorizeScore(prediction.predictedScore);
    const actualCategory = this.categorizeScore(actualScore);
    
    return {
      predictedCategory,
      actualCategory,
      categoryMatch: predictedCategory === actualCategory,
      accuracy: predictedCategory === actualCategory ? 100 : 
                this.calculateCategorySimilarity(predictedCategory, actualCategory)
    };
  }

  calculateCategorySimilarity(predicted, actual) {
    const categories = ['low_scoring', 'normal', 'high_scoring', 'extreme'];
    const predIndex = categories.indexOf(predicted);
    const actualIndex = categories.indexOf(actual);
    const distance = Math.abs(predIndex - actualIndex);
    
    return Math.max(0, 75 - (distance * 25));
  }

  extractDiverseScoreLearning(prediction, actualScore) {
    return {
      scoreType: this.categorizeScore(actualScore),
      extremeScoreOccurred: this.isExtremeScore(actualScore),
      predictionAdequacy: this.assessPredictionAdequacy(prediction, actualScore),
      learningPriority: this.isExtremeScore(actualScore) ? 'high' : 'normal',
      algorithmAdjustment: this.suggestAlgorithmAdjustment(prediction, actualScore)
    };
  }

  assessPredictionAdequacy(prediction, actualScore) {
    const accuracy = this.calculateAdvancedPredictionAccuracy(prediction, actualScore);
    if (accuracy >= 90) return 'excellent';
    if (accuracy >= 70) return 'good';
    if (accuracy >= 50) return 'acceptable';
    return 'needs_improvement';
  }

  suggestAlgorithmAdjustment(prediction, actualScore) {
    const actualIsExtreme = this.isExtremeScore(actualScore);
    const predictedExtreme = this.isExtremeScore(prediction.predictedScore);
    
    if (actualIsExtreme && !predictedExtreme) {
      return 'increase_extreme_score_weight';
    } else if (!actualIsExtreme && predictedExtreme) {
      return 'decrease_extreme_score_weight';
    }
    return 'maintain_current_weights';
  }

  assessAdvancedPredictionQuality(prediction, score) {
    const baseQuality = this.assessPredictionQuality(prediction, { actualScore: score.finalScore, correct: prediction.predictedScore === score.finalScore });
    const extremeScoreBonus = this.isExtremeScore(score.finalScore) && this.isExtremeScore(prediction.predictedScore) ? 1 : 0;
    
    return {
      ...baseQuality,
      extremeScoreBonus,
      enhancedQuality: extremeScoreBonus ? 'exceptional' : baseQuality.quality,
      diverseScoreCapability: true
    };
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