import React, { useEffect, useState } from "react";
import { predictionService } from "@/services/api/predictionService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const PredictionHistory = ({ refreshTrigger }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadPredictions = async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await predictionService.getAll();
      setPredictions(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (err) {
      setError("Erreur lors du chargement de l'historique");
      console.error("Error loading predictions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh temps réel toutes les 5 minutes
  useEffect(() => {
    loadPredictions();
    const interval = setInterval(() => {
      loadPredictions();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  const getAccuracyRate = () => {
    const completedPredictions = predictions.filter(p => p.actualResult);
    if (completedPredictions.length === 0) return 0;
    const correct = completedPredictions.filter(p => p.actualResult.correct).length;
    return Math.round((correct / completedPredictions.length) * 100);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-primary";
    if (confidence >= 60) return "text-accent";
    if (confidence >= 40) return "text-warning";
    return "text-gray-400";
  };

  // Statuts temps réel avec heures exactes
  const getStatusBadge = (prediction) => {
    const now = new Date();
    const matchTime = new Date(prediction.matchDateTime);
    const timeDiff = matchTime - now;
    
    if (prediction.actualResult) {
      return prediction.actualResult.correct ? (
        <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium border border-primary/30">
          <ApperIcon name="CheckCircle" size={12} className="inline mr-1" />
          Correct - {format(matchTime, "HH:mm", { locale: fr })}
        </span>
      ) : (
        <span className="px-2 py-1 bg-error/20 text-error rounded-full text-xs font-medium border border-error/30">
          <ApperIcon name="XCircle" size={12} className="inline mr-1" />
          Incorrect - {format(matchTime, "HH:mm", { locale: fr })}
        </span>
      );
    }
    
    // Match en cours (dans les 2h autour de l'heure programmée)
    if (Math.abs(timeDiff) <= 2 * 60 * 60 * 1000 && timeDiff <= 30 * 60 * 1000) {
      return (
        <span className="px-2 py-1 bg-info/20 text-info rounded-full text-xs font-medium border border-info/30 animate-pulse">
          <ApperIcon name="Zap" size={12} className="inline mr-1" />
          LIVE - {format(matchTime, "HH:mm", { locale: fr })}
        </span>
      );
    }
    
    // Match à venir avec temps réel
    return (
      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium border border-gray-500/30">
        <ApperIcon name="Clock" size={12} className="inline mr-1" />
{timeDiff > 0 ? `À venir - ${format(matchTime, "HH:mm", { locale: fr })}` : `Programmé - ${format(matchTime, "HH:mm", { locale: fr })}`}
      </span>
    );
  };

const checkScore = async (predictionId) => {
    try {
      const result = await predictionService.checkScoresWith1XBET(predictionId);
      const prediction = predictions.find(p => p.Id === predictionId);
      const matchTime = prediction ? format(new Date(prediction.matchDateTime), "HH:mm", { locale: fr }) : 'N/A';
      
      // Messages temps réel avec heures exactes
      if (result.status === 'terminé') {
        if (result.correct) {
          toast.success(
            `🎯 ${matchTime} - IA EXACTE! Score ${result.actualScore} prédit avec ${prediction?.confidence || 'N/A'}% confiance | Mi-temps: ${result.actualHalftimeScore || 'N/A'} ${result.halftimeCorrect ? '✓' : ''}`,
            { autoClose: 6000 }
          );
        } else {
          toast.warning(
            `📊 ${matchTime} - Analyse: ${result.actualScore} vs ${prediction?.predictedScore || 'N/A'} | Mi-temps réel: ${result.actualHalftimeScore || 'N/A'} vs ${prediction?.predictedHalftimeScore || 'N/A'} | Apprentissage IA activé`,
            { autoClose: 5000 }
          );
        }
        loadPredictions(); // Actualiser la liste temps réel
      } else if (result.status === 'en_cours') {
        const currentTime = format(new Date(), "HH:mm", { locale: fr });
        toast.info(
          `⚡ ${currentTime} LIVE: ${result.currentScore} (${result.minute}') | Mi-temps réel: ${result.currentScore?.includes('-') && parseInt(result.minute) >= 45 ? result.currentScore : 'En cours'} | Prédiction finale: ${result.realTimePredictions?.adjustedPrediction || 'N/A'} | IA-confidence: ${result.realTimePredictions?.confidenceAdjustment?.newConfidence || 'N/A'}%`,
          { autoClose: 5000 }
        );
      } else if (result.status === 'a_venir') {
        toast.info(
          `🚀 ${matchTime} - IA v3.2 optimisée | Confiance: ${prediction?.confidence || 'N/A'}% | Mi-temps activé: ${prediction?.predictedHalftimeScore ? 'OUI (' + prediction.predictedHalftimeScore + ')' : 'NON'} | 4 scores exacts intégrés | Algorithmes: ${prediction?.algorithmBreakdown?.length || 7} actifs`,
          { autoClose: 4000 }
        );
      } else {
        toast.error(`🔧 ${matchTime} - ${result.message || "Erreur lors de la vérification"}`, { autoClose: 4000 });
      }
      
    } catch (error) {
      toast.error(`🔧 ${format(new Date(), "HH:mm", { locale: fr })} - Erreur système: ${error.message}`, { autoClose: 4000 });
    }
  };

  const checkAllScores = async () => {
    try {
      toast.info("🔄 Analyse IA en cours sur toutes les prédictions...", { autoClose: 2000 });
      const results = await predictionService.checkAllPendingScores();
      
      // Analyse des résultats
      const finished = results.filter(r => r.status === 'terminé');
      const live = results.filter(r => r.status === 'en_cours');
      const correct = finished.filter(r => r.correct);
      const errors = results.filter(r => r.error);
      
      // Message de résumé détaillé
      if (finished.length > 0) {
        const accuracy = Math.round((correct.length / finished.length) * 100);
        toast.success(
          `📈 ${finished.length} résultat(s) finalisés | Précision IA: ${accuracy}% | ${live.length} match(s) en cours`,
          { autoClose: 6000 }
        );
        loadPredictions();
      } else if (live.length > 0) {
        toast.info(
          `⚽ ${live.length} match(s) en direct suivis par l'IA | Mise à jour temps réel active`,
          { autoClose: 4000 }
        );
      } else if (errors.length === 0) {
        toast.info("✅ Toutes les prédictions sont à jour | Système IA opérationnel", { autoClose: 3000 });
      } else {
        toast.warning(
          `⚠️ ${errors.length} erreur(s) détectées | Mode de récupération activé`,
          { autoClose: 4000 }
        );
      }
      
// Log détaillé pour le débogage (en développement)
      if (import.meta.env.DEV) {
        console.log('📊 Rapport de vérification IA:', {
          total: results.length,
          terminés: finished.length,
          enCours: live.length,
          précision: finished.length > 0 ? Math.round((correct.length / finished.length) * 100) : 0,
          erreurs: errors.length
        });
      }
      
    } catch (error) {
      toast.error(`🚨 Erreur système critique: ${error.message}`, { autoClose: 5000 });
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPredictions} />;
  if (predictions.length === 0) return <Empty />;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-info to-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="History" size={20} className="text-black" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">Historique des Prédictions</h3>
            <p className="text-sm text-gray-400">
              {predictions.length} prédiction{predictions.length > 1 ? "s" : ""} • 
              Précision: {getAccuracyRate()}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkAllScores}
            className="flex items-center gap-2 bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
          >
            <ApperIcon name="Zap" size={16} />
            1XBET
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPredictions}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Actualiser
          </Button>
        </div>
      </div>

<div className="space-y-4 max-h-[500px] overflow-y-auto">
        {predictions.map((prediction) => (
          <div
            key={prediction.Id}
            className="bg-surface/30 border border-secondary-400/20 rounded-lg p-4 hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ApperIcon name="Shield" size={16} className="text-primary" />
                <div>
<div className="font-medium text-white">
                    {prediction.homeTeam} vs {prediction.awayTeam}
                  </div>
                  {prediction.predictedWinner && (
                    <div className="text-xs text-primary mt-1">
                      Vainqueur: {prediction.predictedWinner}
                    </div>
                  )}
                  {/* Affichage temps réel avec heures exactes */}
                  <div className="text-xs text-gray-400">
                    {format(new Date(prediction.matchDateTime), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                    <span className="ml-2 text-xs px-1 py-0.5 bg-accent/20 text-accent rounded">
                      {(() => {
                        const now = new Date();
                        const matchTime = new Date(prediction.matchDateTime);
                        const diff = matchTime - now;
                        if (diff > 24 * 60 * 60 * 1000) return `J-${Math.floor(diff / (24 * 60 * 60 * 1000))}`;
                        if (diff > 60 * 60 * 1000) return `H-${Math.floor(diff / (60 * 60 * 1000))}`;
                        if (diff > 0) return `${Math.floor(diff / (60 * 1000))}min`;
                        if (Math.abs(diff) <= 2 * 60 * 60 * 1000) return 'LIVE';
                        return 'Terminé';
                      })()}
                    </span>
                  </div>
                </div>
              </div>
              {getStatusBadge(prediction)}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold gradient-text">
                  {prediction.predictedScore}
                </div>
                {/* 4 Scores mi-temps exacts intégrés */}
                {prediction.predictedHalftimeScore && (
                  <div className="text-xs text-accent">
                    Mi-temps: {prediction.predictedHalftimeScore}
                    {prediction.predictedHalftimeWinner && ` (${prediction.predictedHalftimeWinner})`}
                    <div className="text-xs text-accent/70 mt-0.5">4 scores exacts ✓</div>
                  </div>
                )}
                <div className="text-xs text-gray-500">Prédiction IA v3.2</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}%
                </div>
                {prediction.halftimeConfidence && (
                  <div className="text-xs text-accent/70">
                    Mi-temps: {prediction.halftimeConfidence}%
                  </div>
                )}
                <div className="text-xs text-gray-500">Confiance IA</div>
              </div>

              <div className="text-center">
                {prediction.actualResult ? (
                  <div>
                    <div className="text-lg font-bold text-white">
                      {prediction.actualResult.actualScore}
                    </div>
                    {prediction.actualResult.actualHalftimeScore && (
                      <div className="text-xs text-white/70">
                        Mi-temps: {prediction.actualResult.actualHalftimeScore}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-lg font-bold text-gray-500">En attente</div>
                )}
                <div className="text-xs text-gray-500">Résultat temps réel</div>
              </div>
            </div>

            {/* Informations temps réel détaillées */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-400">Prédit:</span>{" "}
                  <span className="text-primary font-medium">{prediction.predictedScore}</span>
                  {prediction.predictedWinner && (
                    <span className="text-xs text-primary ml-2">({prediction.predictedWinner})</span>
                  )}
                </div>
                {prediction.predictedHalftimeScore && (
                  <div className="text-sm">
                    <span className="text-gray-400">Mi-temps:</span>{" "}
                    <span className="text-accent font-medium">{prediction.predictedHalftimeScore}</span>
                    {prediction.predictedHalftimeWinner && (
                      <span className="text-xs text-accent ml-2">({prediction.predictedHalftimeWinner})</span>
                    )}
                  </div>
                )}
                {prediction.actualResult && (
                  <div className="text-sm">
                    <span className="text-gray-400">Réel:</span>{" "}
                    <span className="text-white font-medium">{prediction.actualResult.actualScore}</span>
                    {prediction.actualResult.actualWinner && (
                      <span className="text-xs text-white ml-2">({prediction.actualResult.actualWinner})</span>
                    )}
                    {prediction.actualResult.actualHalftimeScore && (
                      <span className="text-xs text-white/70 ml-2">MT: {prediction.actualResult.actualHalftimeScore}</span>
                    )}
                  </div>
                )}
                {prediction.actualResult && prediction.actualResult.actualHalftimeScore && (
                  <div className="text-sm">
                    <span className="text-gray-400">Mi-temps réel:</span>{" "}
                    <span className="text-white font-medium">{prediction.actualResult.actualHalftimeScore}</span>
                    {prediction.actualResult.actualHalftimeWinner && (
                      <span className="text-xs text-white ml-2">({prediction.actualResult.actualHalftimeWinner})</span>
                    )}
                  </div>
                )}
              </div>
              
              {!prediction.actualResult && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => checkScore(prediction.Id)}
                  className="text-accent hover:text-accent hover:bg-accent/10"
                >
                  <ApperIcon name="Search" size={14} />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
              <span>{prediction.scoreOdds?.length || 0} scores analysés</span>
              <span>
                {format(new Date(prediction.timestamp), "dd/MM/yyyy HH:mm", { locale: fr })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PredictionHistory;