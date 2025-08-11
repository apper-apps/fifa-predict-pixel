import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import ScoreOddsInput from "@/components/molecules/ScoreOddsInput";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const MatchForm = ({ onSubmit, isLoading }) => {
const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    matchDate: "",
    matchTime: "",
    scoreOdds: Array(5).fill({ score: "", coefficient: "" }),
    halftimeScoreOdds: Array(4).fill({ score: "", coefficient: "" }),
    confrontations: Array(5).fill({ coefficient: "" }),
    confrontationHalftimeScores: Array(4).fill({ score: "", coefficient: "" }),
    expectedHalftimeScore: ""
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

const handleScoreOddsChange = (index, data) => {
    setFormData(prev => {
      const newScoreOdds = [...prev.scoreOdds];
      newScoreOdds[index] = data;
      return { ...prev, scoreOdds: newScoreOdds };
    });
  };

const handleConfrontationChange = (index, value) => {
    setFormData(prev => {
      const newConfrontations = [...prev.confrontations];
      newConfrontations[index] = { coefficient: value };
      return { ...prev, confrontations: newConfrontations };
    });
  };

  const handleConfrontationHalftimeChange = (index, data) => {
    setFormData(prev => {
      const newHalftimeScores = [...prev.confrontationHalftimeScores];
      newHalftimeScores[index] = data;
      return { ...prev, confrontationHalftimeScores: newHalftimeScores };
    });
  };

  const addScoreField = () => {
    if (formData.scoreOdds.length < 20) {
      setFormData(prev => ({
        ...prev,
        scoreOdds: [...prev.scoreOdds, { score: "", coefficient: "" }]
      }));
    }
  };

  const removeScoreField = (index) => {
    if (formData.scoreOdds.length > 1) {
      setFormData(prev => ({
        ...prev,
        scoreOdds: prev.scoreOdds.filter((_, i) => i !== index)
      }));
    }
  };

const validateForm = () => {
    const newErrors = {};

    if (!formData.homeTeam.trim()) {
      newErrors.homeTeam = "L'équipe domicile est requise";
    }
    if (!formData.awayTeam.trim()) {
      newErrors.awayTeam = "L'équipe visiteur est requise";
    }
    if (!formData.matchDate) {
      newErrors.matchDate = "La date du match est requise";
    }
    if (!formData.matchTime) {
      newErrors.matchTime = "L'heure du match est requise";
    }

    const validScoreOdds = formData.scoreOdds.filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    );

    if (validScoreOdds.length < 3) {
      newErrors.scoreOdds = "Minimum 3 scores temps complet avec coefficients requis";
    }

    const validHalftimeScoreOdds = formData.halftimeScoreOdds.filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    );
if (validHalftimeScoreOdds.length < 3) {
      newErrors.halftimeScoreOdds = "Minimum 3 scores mi-temps avec coefficients requis";
    }

    // Validation des confrontations
const validConfrontations = formData.confrontations.filter(conf => 
      conf.coefficient && !isNaN(conf.coefficient) && parseFloat(conf.coefficient) > 0
    );
    if (validConfrontations.length < 5) {
      newErrors.confrontations = "Les 5 coefficients de confrontations sont requis";
    }

    const validConfrontationHalftime = formData.confrontationHalftimeScores.filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    );
    if (validConfrontationHalftime.length < 4) {
      newErrors.confrontationHalftimeScores = "4 scores mi-temps avec coefficients requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

const validScoreOdds = formData.scoreOdds.filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    );
    
    const validHalftimeScoreOdds = (formData.halftimeScoreOdds || []).filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    );

// Pré-analyse IA des données
    const aiPreAnalysis = await performPreAnalysis(formData.homeTeam, formData.awayTeam);
    
    // Filtrer les confrontations valides
const validConfrontations = formData.confrontations.filter(conf => 
      conf.description.trim() && conf.analysis.trim()
    );

    const validConfrontationHalftime = (formData.confrontationHalftime || []).filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    );
    
    const matchData = {
      homeTeam: formData.homeTeam.trim(),
      awayTeam: formData.awayTeam.trim(),
      dateTime: `${formData.matchDate} ${formData.matchTime}`,
      scoreOdds: validScoreOdds.map(item => ({
        score: item.score.trim(),
        coefficient: parseFloat(item.coefficient) || 1.0,
        probability: parseFloat(item.coefficient) > 0 ? ((1 / parseFloat(item.coefficient)) * 100).toFixed(1) : "0.0"
      })),
      halftimeScoreOdds: validHalftimeScoreOdds.map(item => ({
        score: item.score.trim(),
        coefficient: parseFloat(item.coefficient) || 1.0,
        probability: parseFloat(item.coefficient) > 0 ? ((1 / parseFloat(item.coefficient)) * 100).toFixed(1) : "0.0"
      })),
confrontations: validConfrontations.map(conf => ({
        coefficient: parseFloat(conf.coefficient)
      })),
      confrontationHalftimeScores: validConfrontationHalftime.map(item => ({
        score: item.score.trim(),
        coefficient: parseFloat(item.coefficient) || 1.0,
        probability: parseFloat(item.coefficient) > 0 ? ((1 / parseFloat(item.coefficient)) * 100).toFixed(1) : "0.0"
      })),
      expectedHalftimeScore: formData.expectedHalftimeScore.trim(),
      aiPreAnalysis: aiPreAnalysis
    };

    // Toast avec informations IA
    toast.info(
      `🧠 IA activée: ${aiPreAnalysis.confidence}% confiance | ${aiPreAnalysis.riskLevel} risque`,
      { autoClose: 4000 }
    );

    onSubmit(matchData);
  };

  // Nouvelle fonction d'analyse préliminaire
  const performPreAnalysis = async (homeTeam, awayTeam) => {
    // Simulation d'analyse IA préliminaire
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const teamStrength = analyzeTeamStrength(homeTeam, awayTeam);
    const marketTrends = analyzeFormMarketTrends();
    
    return {
      teamAnalysis: teamStrength,
      marketSentiment: marketTrends,
      confidence: Math.round(teamStrength.overallRating + marketTrends.confidence),
      riskLevel: teamStrength.riskLevel,
      keyFactors: [
        `Force équipes: ${teamStrength.strengthRatio}`,
        `Tendance marché: ${marketTrends.trend}`,
        `Historique: ${teamStrength.historicalAdvantage}`
      ]
    };
  };

  const analyzeTeamStrength = (homeTeam, awayTeam) => {
    // Simulation basée sur les noms d'équipes
    const homeStrength = getTeamStrength(homeTeam);
    const awayStrength = getTeamStrength(awayTeam);
    
    return {
      homeStrength,
      awayStrength,
      strengthRatio: (homeStrength / awayStrength).toFixed(2),
      overallRating: Math.round((homeStrength + awayStrength) / 2),
      riskLevel: Math.abs(homeStrength - awayStrength) > 20 ? 'faible' : Math.abs(homeStrength - awayStrength) > 10 ? 'moyen' : 'élevé',
      historicalAdvantage: homeStrength > awayStrength ? 'domicile' : 'visiteur'
    };
  };

  const getTeamStrength = (teamName) => {
    // Algorithme simple basé sur le nom (simulation)
    const name = teamName.toLowerCase();
    let strength = 50;
    
    // Équipes "fortes" simulées
    if (name.includes('manchester') || name.includes('liverpool') || name.includes('chelsea')) strength += 25;
    else if (name.includes('arsenal') || name.includes('tottenham') || name.includes('city')) strength += 20;
    else if (name.includes('united') || name.includes('real') || name.includes('barcelona')) strength += 30;
    
    // Variation aléatoire
    strength += Math.floor(Math.random() * 20 - 10);
    
    return Math.max(30, Math.min(90, strength));
  };

  const analyzeFormMarketTrends = () => {
    return {
      trend: Math.random() > 0.5 ? 'haussier' : 'baissier',
      volatility: Math.random() > 0.7 ? 'élevée' : 'normale',
      confidence: Math.floor(Math.random() * 30 + 60), // 60-90%
      marketSentiment: Math.random() > 0.6 ? 'optimiste' : 'prudent'
    };
  };

  const clearForm = () => {
setFormData({
      homeTeam: "",
      awayTeam: "",
      matchDate: "",
      matchTime: "",
      scoreOdds: Array(5).fill({ score: "", coefficient: "" }),
      halftimeScoreOdds: Array(4).fill({ score: "", coefficient: "" }),
      confrontations: Array(5).fill({ coefficient: "" }),
      confrontationHalftimeScores: Array(4).fill({ score: "", coefficient: "" }),
      expectedHalftimeScore: ""
    });
    setErrors({});
    toast.success("Formulaire réinitialisé");
  };

  const getFilledScoresCount = () => {
    return formData.scoreOdds.filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    ).length;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" size={20} className="text-black" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">Nouveau Match</h2>
            <p className="text-sm text-gray-400">FIFA Virtual - FC 24 Championship</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearForm}
          className="flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={16} />
          Effacer
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Équipe Domicile"
            placeholder="Manchester City"
            value={formData.homeTeam}
            onChange={(e) => handleInputChange("homeTeam", e.target.value)}
            error={errors.homeTeam}
            required
          />
          <FormField
            label="Équipe Visiteur"
            placeholder="Liverpool"
            value={formData.awayTeam}
            onChange={(e) => handleInputChange("awayTeam", e.target.value)}
            error={errors.awayTeam}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Date du Match"
            type="date"
            value={formData.matchDate}
            onChange={(e) => handleInputChange("matchDate", e.target.value)}
            error={errors.matchDate}
            required
          />
          <FormField
            label="Heure du Match"
            type="time"
            value={formData.matchTime}
            onChange={(e) => handleInputChange("matchTime", e.target.value)}
            error={errors.matchTime}
            required
          />
        </div>
{/* Section scores mi-temps */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ApperIcon name="Clock" size={20} className="text-accent" />
              <h3 className="text-lg font-semibold text-white">Scores Mi-temps</h3>
            </div>
            
            <div className="mb-4">
              <FormField
                label="Score attendu mi-temps"
                error={errors.expectedHalftimeScore}
              >
                <Input
                  type="text"
                  placeholder="Ex: 1-0"
                  value={formData.expectedHalftimeScore}
                  onChange={(e) => handleInputChange('expectedHalftimeScore', e.target.value)}
                />
              </FormField>
            </div>

            <ScoreOddsInput
              title="Cotes Scores Mi-temps (4 scenarios)"
              scoreOdds={formData.halftimeScoreOdds}
              onChange={(index, data) => {
                const newHalftimeScoreOdds = [...formData.halftimeScoreOdds];
                newHalftimeScoreOdds[index] = data;
                setFormData({ ...formData, halftimeScoreOdds: newHalftimeScoreOdds });
              }}
              onAdd={() => {
                if (formData.halftimeScoreOdds.length < 6) {
                  setFormData({
                    ...formData,
                    halftimeScoreOdds: [...formData.halftimeScoreOdds, { score: "", coefficient: "" }]
                  });
                }
              }}
              onRemove={(index) => {
                if (formData.halftimeScoreOdds.length > 3) {
                  const newHalftimeScoreOdds = formData.halftimeScoreOdds.filter((_, i) => i !== index);
                  setFormData({ ...formData, halftimeScoreOdds: newHalftimeScoreOdds });
                }
              }}
              error={errors.halftimeScoreOdds}
              maxItems={6}
              minItems={3}
            />
          </div>

          {/* Section confrontations entre équipes */}
<div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ApperIcon name="Users" size={20} className="text-accent" />
              <h3 className="text-lg font-semibold text-white">5 Confrontations Directes (Coefficients)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {formData.confrontations.map((confrontation, index) => (
                <Card key={index} className="p-4 bg-surface/50">
                  <FormField
                    label={`Confrontation ${index + 1}`}
                  >
                    <Input
                      type="number"
                      step="0.01"
                      min="1.01"
                      placeholder="Ex: 2.50"
                      value={confrontation.coefficient}
                      onChange={(e) => handleConfrontationChange(index, e.target.value)}
                    />
                  </FormField>
                </Card>
              ))}
            </div>
            {errors.confrontations && (
              <p className="text-sm text-error mt-1">{errors.confrontations}</p>
            )}
          </div>

          {/* Section scores mi-temps des confrontations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ApperIcon name="Clock" size={20} className="text-accent" />
              <h3 className="text-lg font-semibold text-white">4 Scores Mi-temps Confrontations</h3>
            </div>
            
            <ScoreOddsInput
              title="Scores Exacts Mi-temps des Confrontations"
              scoreOdds={formData.confrontationHalftimeScores}
              onChange={(index, data) => handleConfrontationHalftimeChange(index, data)}
              onAdd={() => {
                if (formData.confrontationHalftimeScores.length < 6) {
                  setFormData({
                    ...formData,
                    confrontationHalftimeScores: [...formData.confrontationHalftimeScores, { score: "", coefficient: "" }]
                  });
                }
              }}
              onRemove={(index) => {
                if (formData.confrontationHalftimeScores.length > 4) {
                  const newScores = formData.confrontationHalftimeScores.filter((_, i) => i !== index);
                  setFormData({ ...formData, confrontationHalftimeScores: newScores });
                }
              }}
              error={errors.confrontationHalftimeScores}
              maxItems={6}
              minItems={4}
            />
          </div>
        <div className="border-t border-primary/20 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Scores et Coefficients</h3>
              <p className="text-sm text-gray-400">
                {getFilledScoresCount()}/20 scores remplis • Min. 3 requis
              </p>
            </div>
            {formData.scoreOdds.length < 20 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addScoreField}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                Ajouter
              </Button>
            )}
          </div>

          {errors.scoreOdds && (
            <p className="text-sm text-error mb-4">{errors.scoreOdds}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {formData.scoreOdds.map((scoreOdds, index) => (
              <ScoreOddsInput
                key={index}
                index={index}
                value={scoreOdds}
                onChange={handleScoreOddsChange}
                onRemove={removeScoreField}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-primary/20">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 h-12"
          >
            {isLoading ? (
              <>
                <ApperIcon name="Loader2" size={20} className="animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
<ApperIcon name="Brain" size={20} />
                {getFilledScoresCount() >= 3 ? 'Générer Prédiction IA Avancée' : 'Générer Prédiction IA'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MatchForm;