// Service simulé pour l'API 1XBET - Récupération des scores réels
class XBetService {
  constructor() {
    this.apiUrl = 'https://1xbet.com/api/v1'; // URL simulée
    this.isConnected = true;
    
    // Simulation de données réelles de matchs FIFA Virtual
    this.mockMatches = [
      {
        id: 'match_001',
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        status: 'finished',
        finalScore: '2-1',
        startTime: '2024-01-15T15:00:00Z',
        league: 'FIFA Virtual Premier League'
      },
      {
        id: 'match_002',
        homeTeam: 'Chelsea',
        awayTeam: 'Arsenal',
        status: 'live',
        currentScore: '1-0',
        minute: 67,
        startTime: '2024-01-15T17:30:00Z',
        league: 'FIFA Virtual Premier League'
      },
      {
        id: 'match_003',
        homeTeam: 'Tottenham',
        awayTeam: 'Manchester United',
        status: 'upcoming',
        startTime: '2024-01-15T20:00:00Z',
        league: 'FIFA Virtual Premier League'
      }
    ];
  }

  async getMatchResult(homeTeam, awayTeam, matchDateTime) {
    // Simulation d'une requête API avec délai
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (!this.isConnected) {
      throw new Error('Connexion 1XBET indisponible');
    }

    // Rechercher le match correspondant
    const match = this.mockMatches.find(m => 
      this.normalizeTeamName(m.homeTeam) === this.normalizeTeamName(homeTeam) &&
      this.normalizeTeamName(m.awayTeam) === this.normalizeTeamName(awayTeam)
    );

    if (match) {
      return this.formatMatchResult(match);
    }

    // Si aucun match trouvé, générer un résultat simulé
    return this.generateSimulatedResult(homeTeam, awayTeam, matchDateTime);
  }

  async getLiveMatches() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockMatches
      .filter(match => match.status === 'live')
      .map(match => this.formatMatchResult(match));
  }

  async getFinishedMatches(date = new Date()) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const targetDate = new Date(date).toDateString();
    
    return this.mockMatches
      .filter(match => {
        const matchDate = new Date(match.startTime).toDateString();
        return match.status === 'finished' && matchDate === targetDate;
      })
      .map(match => this.formatMatchResult(match));
  }

  formatMatchResult(match) {
    const baseResult = {
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      status: match.status,
      league: match.league,
      startTime: match.startTime
    };

    switch (match.status) {
      case 'finished':
        return {
          ...baseResult,
          finalScore: match.finalScore,
          result: 'Terminé'
        };
      
      case 'live':
        return {
          ...baseResult,
          currentScore: match.currentScore,
          minute: match.minute,
          result: `${match.minute}'`
        };
      
      case 'upcoming':
        return {
          ...baseResult,
          scheduledTime: match.startTime,
          result: 'À venir'
        };
      
      default:
        return baseResult;
    }
  }

generateSimulatedResult(homeTeam, awayTeam, matchDateTime) {
    const matchDate = new Date(matchDateTime);
    const now = new Date();
    
    // Déterminer le statut basé sur l'heure
    if (matchDate > now) {
      return {
        homeTeam,
        awayTeam,
        status: 'upcoming',
        scheduledTime: matchDateTime,
        result: 'À venir',
        aiPrediction: this.generateAIPredictionHint(homeTeam, awayTeam)
      };
    } else if (matchDate <= now && (now - matchDate) < 90 * 60 * 1000) {
      // Match en cours (moins de 90 minutes)
      const minute = Math.min(90, Math.floor((now - matchDate) / (60 * 1000)));
      const currentScore = this.generateIntelligentScore(homeTeam, awayTeam);
      
      // Ajuster le score selon le temps écoulé
      const adjustedScore = this.adjustScoreForTime(currentScore, minute);
      
      return {
        homeTeam,
        awayTeam,
        status: 'live',
        currentScore: adjustedScore,
        minute,
        result: `${minute}'`,
        intensity: this.calculateMatchIntensity(minute),
        nextGoalProb: this.calculateNextGoalProbability(adjustedScore, minute)
      };
    } else {
      // Match terminé
      const finalScore = this.generateIntelligentScore(homeTeam, awayTeam);
      const matchAnalysis = this.generatePostMatchAnalysis(homeTeam, awayTeam, finalScore);
      
      return {
        homeTeam,
        awayTeam,
        status: 'finished',
        finalScore,
        result: 'Terminé',
        matchAnalysis,
        keyMoments: this.generateKeyMoments(finalScore),
        performance: this.generatePerformanceRatings(homeTeam, awayTeam, finalScore)
      };
    }
  }

  adjustScoreForTime(score, minute) {
    const [homeGoals, awayGoals] = score.split('-').map(Number);
    
    // Réduire les buts selon le temps écoulé (probabilité qu'ils aient déjà été marqués)
    const timeFactor = minute / 90;
    const adjustedHome = Math.floor(homeGoals * timeFactor);
    const adjustedAway = Math.floor(awayGoals * timeFactor);
    
    return `${adjustedHome}-${adjustedAway}`;
  }

  calculateMatchIntensity(minute) {
    // L'intensité varie selon les phases du match
    if (minute < 15) return 'build_up';
    if (minute < 30) return 'moderate';
    if (minute < 45) return 'intense';
    if (minute < 60) return 'moderate';
    if (minute < 75) return 'intense';
    if (minute < 90) return 'critical';
    return 'final_moments';
  }

  calculateNextGoalProbability(score, minute) {
    const [homeGoals, awayGoals] = score.split('-').map(Number);
    const totalGoals = homeGoals + awayGoals;
    const timeRemaining = Math.max(0, 90 - minute);
    
    // Base probability adjusted by current score and time
    let baseProb = 0.03; // 3% per minute base
    
    // Adjust based on current score (more goals = potentially more open game)
    baseProb += totalGoals * 0.005;
    
    // Adjust for time (more urgent near the end)
    if (timeRemaining < 10) baseProb += 0.01;
    if (minute > 80) baseProb += 0.005;
    
    return Math.min(0.15, baseProb * timeRemaining); // Max 15% chance
  }

  generateAIPredictionHint(homeTeam, awayTeam) {
    const homeStrength = this.getTeamStrengthFromName(homeTeam);
    const awayStrength = this.getTeamStrengthFromName(awayTeam);
    
    return {
      favoriteTeam: homeStrength > awayStrength ? homeTeam : awayTeam,
      strengthDifference: Math.abs(homeStrength - awayStrength),
      predictedOutcome: this.predictOutcome(homeStrength, awayStrength),
      confidence: this.calculatePredictionConfidence(homeStrength, awayStrength)
    };
  }

  predictOutcome(homeStrength, awayStrength) {
    const homeTotal = homeStrength * 1.3; // Home advantage
    const awayTotal = awayStrength;
    
    if (homeTotal > awayTotal + 10) return 'home_win';
    if (awayTotal > homeTotal + 5) return 'away_win';
    return 'draw_possible';
  }

  calculatePredictionConfidence(homeStrength, awayStrength) {
    const difference = Math.abs(homeStrength - awayStrength);
    return Math.min(95, Math.max(55, 60 + difference));
  }

  generatePostMatchAnalysis(homeTeam, awayTeam, finalScore) {
    const [homeGoals, awayGoals] = finalScore.split('-').map(Number);
    
    return {
      dominance: homeGoals > awayGoals ? 'home' : awayGoals > homeGoals ? 'away' : 'balanced',
      scoringRate: (homeGoals + awayGoals) > 3 ? 'high' : (homeGoals + awayGoals) > 1 ? 'normal' : 'low',
      competitiveness: Math.abs(homeGoals - awayGoals) <= 1 ? 'very_competitive' : 'clear_winner',
      surprise: this.isSurpriseResult(homeTeam, awayTeam, finalScore)
    };
  }

  generateKeyMoments(finalScore) {
    const [homeGoals, awayGoals] = finalScore.split('-').map(Number);
    const totalGoals = homeGoals + awayGoals;
    const moments = [];
    
    for (let i = 0; i < totalGoals; i++) {
      moments.push({
        minute: Math.floor(Math.random() * 90) + 1,
        team: Math.random() > 0.5 ? 'home' : 'away',
        type: 'goal'
      });
    }
    
    return moments.sort((a, b) => a.minute - b.minute);
  }

  generatePerformanceRatings(homeTeam, awayTeam, finalScore) {
    const [homeGoals, awayGoals] = finalScore.split('-').map(Number);
    
    const homeRating = 5.0 + (homeGoals * 1.5) + (Math.random() * 2);
    const awayRating = 5.0 + (awayGoals * 1.5) + (Math.random() * 2);
    
    return {
      [homeTeam]: Math.min(10, Math.max(3, homeRating)).toFixed(1),
      [awayTeam]: Math.min(10, Math.max(3, awayRating)).toFixed(1)
    };
  }

  isSurpriseResult(homeTeam, awayTeam, finalScore) {
    const homeStrength = this.getTeamStrengthFromName(homeTeam);
    const awayStrength = this.getTeamStrengthFromName(awayTeam);
    const [homeGoals, awayGoals] = finalScore.split('-').map(Number);
    
    const expectedHomeWin = homeStrength > awayStrength + 15;
    const expectedAwayWin = awayStrength > homeStrength + 10;
    
    const actualHomeWin = homeGoals > awayGoals;
    const actualAwayWin = awayGoals > homeGoals;
    
    return (expectedHomeWin && !actualHomeWin) || (expectedAwayWin && !actualAwayWin);
  }

generateRandomScore() {
    // Algorithme amélioré de génération de scores basé sur des probabilités réalistes
    const scoreProbabilities = [
      { score: '1-0', weight: 15 },
      { score: '0-1', weight: 12 },
      { score: '2-1', weight: 14 },
      { score: '1-2', weight: 11 },
      { score: '2-0', weight: 10 },
      { score: '0-2', weight: 8 },
      { score: '1-1', weight: 13 },
      { score: '2-2', weight: 7 },
      { score: '3-1', weight: 5 },
      { score: '1-3', weight: 4 },
      { score: '3-0', weight: 3 },
      { score: '0-3', weight: 2 },
      { score: '0-0', weight: 6 }
    ];
    
    const totalWeight = scoreProbabilities.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of scoreProbabilities) {
      random -= item.weight;
      if (random <= 0) {
        return item.score;
      }
    }
    
    // Fallback
    const homeGoals = Math.floor(Math.random() * 3);
    const awayGoals = Math.floor(Math.random() * 3);
    return `${homeGoals}-${awayGoals}`;
  }

  // Nouvelle méthode pour générer des scores basés sur la force des équipes
  generateIntelligentScore(homeTeam, awayTeam) {
    const homeStrength = this.getTeamStrengthFromName(homeTeam);
    const awayStrength = this.getTeamStrengthFromName(awayTeam);
    const homeAdvantage = 0.3; // 30% d'avantage à domicile
    
    // Calcul des buts attendus basé sur la force
    const homeExpectedGoals = (homeStrength / 70) * (1 + homeAdvantage) * 1.5;
    const awayExpectedGoals = (awayStrength / 70) * (1 - homeAdvantage * 0.5) * 1.5;
    
    // Distribution de Poisson simulée
    const homeGoals = this.poissonRandom(homeExpectedGoals);
    const awayGoals = this.poissonRandom(awayExpectedGoals);
    
    return `${homeGoals}-${awayGoals}`;
  }

  getTeamStrengthFromName(teamName) {
    const name = teamName.toLowerCase();
    let strength = 50;
    
    // Équipes de top niveau
    if (name.includes('manchester city') || name.includes('liverpool')) strength = 85;
    else if (name.includes('chelsea') || name.includes('arsenal')) strength = 78;
    else if (name.includes('tottenham') || name.includes('manchester united')) strength = 75;
    else if (name.includes('real madrid') || name.includes('barcelona')) strength = 88;
    else if (name.includes('bayern') || name.includes('psg')) strength = 83;
    
    // Variation aléatoire pour la simulation
    strength += Math.floor(Math.random() * 20 - 10);
    
    return Math.max(30, Math.min(95, strength));
  }

  poissonRandom(lambda) {
    // Approximation simple de distribution de Poisson
    if (lambda < 0.5) return 0;
    if (lambda < 1.5) return Math.random() < 0.6 ? 1 : 0;
    if (lambda < 2.5) return Math.random() < 0.4 ? 2 : Math.random() < 0.7 ? 1 : 0;
    if (lambda < 3.5) return Math.random() < 0.3 ? 3 : Math.random() < 0.6 ? 2 : 1;
    
    // Pour des valeurs plus élevées, utiliser une approximation normale
    const mean = lambda;
    const variance = lambda;
    const random1 = Math.random();
    const random2 = Math.random();
    
    // Box-Muller transform pour distribution normale
    const normalRandom = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);
    const result = Math.round(mean + Math.sqrt(variance) * normalRandom);
    
    return Math.max(0, Math.min(6, result)); // Limiter entre 0 et 6 buts
  }

  normalizeTeamName(teamName) {
    return teamName.toLowerCase().trim();
  }

  // Méthode pour simuler des problèmes de connexion
  simulateConnectionIssue() {
    this.isConnected = false;
    setTimeout(() => {
      this.isConnected = true;
    }, 5000); // Reconnexion après 5 secondes
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      apiUrl: this.apiUrl,
      lastCheck: new Date().toISOString()
    };
  }
}

export const xbetService = new XBetService();