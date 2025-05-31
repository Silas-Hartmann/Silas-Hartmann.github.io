/**
 * Progress System für Mathematik Stationenlernen
 * Klasse 6 - Terme und Gleichungen
 */

class ProgressTracker {
    constructor() {
        this.storageKey = 'mathe6_progress';
        this.sessionKey = 'mathe6_session';
        this.selectedPath = 'beginner';
        
        // Station-Definitionen basierend auf überarbeiteter Progression
        this.stationDefinitions = {
            'A': {
                id: 'A',
                title: 'Station A - Terme zusammenfassen',
                subtitle: 'Grundlagen: Gleiche Variablen zusammenrechnen',
                description: 'Lerne, wie man gleiche "Bausteine" in Termen zusammenrechnet',
                difficulty: 1,
                prerequisites: [],
                topics: ['Terme', 'Variablen', 'Zusammenfassen'],
                estimatedTime: 15
            },
            'B': {
                id: 'B',
                title: 'Station B - Umkehraufgaben',
                subtitle: 'Jede Operation hat einen Gegenspieler',
                description: 'Verstehe Addition/Subtraktion und Multiplikation/Division als Gegenspieler',
                difficulty: 1,
                prerequisites: [],
                topics: ['Umkehroperationen', 'Addition', 'Subtraktion', 'Grundlagen'],
                estimatedTime: 12
            },
            'C': {
                id: 'C',
                title: 'Station C - Einfache Gleichungen',
                subtitle: 'Umkehrwissen auf Gleichungen anwenden',
                description: 'Wende dein Umkehrwissen auf einfache Gleichungen an',
                difficulty: 2,
                prerequisites: ['B'],
                topics: ['Gleichungen', 'Umkehroperationen', 'Variable isolieren'],
                estimatedTime: 20
            },
            'D': {
                id: 'D',
                title: 'Station D - Mit Zusammenfassen',
                subtitle: 'Terme + Gleichungen kombinieren',
                description: 'Kombiniere Terme zusammenfassen mit Gleichungen lösen',
                difficulty: 3,
                prerequisites: ['A', 'C'],
                topics: ['Terme', 'Gleichungen', 'Kombination', 'Mehrschritt'],
                estimatedTime: 25
            },
            'E': {
                id: 'E',
                title: 'Station E - Komplexere Gleichungen',
                subtitle: 'Master-Level erreicht!',
                description: 'Löse Gleichungen mit Faktoren vor der Variable',
                difficulty: 4,
                prerequisites: ['C', 'D'],
                topics: ['Komplexe Gleichungen', 'Faktoren', 'Mehrschritt', 'Advanced'],
                estimatedTime: 30
            }
        };

        // Lernpfad-Definitionen
        this.learningPaths = {
            beginner: {
                name: 'Einsteiger-Pfad',
                description: 'Systematischer Aufbau von Grundlagen',
                sequence: ['A', 'B', 'C', 'D', 'E'],
                icon: '🌱'
            },
            equations: {
                name: 'Gleichungs-Fokus',
                description: 'Schnell zu Gleichungen, dann Grundlagen',
                sequence: ['B', 'C', 'A', 'D', 'E'],
                icon: '📊'
            },
            terms: {
                name: 'Terme-Spezialist',
                description: 'Terme im Fokus, dann Erweiterung',
                sequence: ['A', 'D', 'C', 'E', 'B'],
                icon: '🧮'
            },
            custom: {
                name: 'Freie Wahl',
                description: 'Du entscheidest den Weg',
                sequence: [],
                icon: '🎯'
            }
        };

        this.initializeStorage();
    }

    // Storage Management
    initializeStorage() {
        if (!this.getStoredProgress()) {
            const initialData = {
                stations: {},
                selectedPath: 'beginner',
                startTime: new Date().toISOString(),
                lastActivity: new Date().toISOString()
            };
            this.saveToStorage(initialData);
        }
    }

    getStoredProgress() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Fehler beim Laden der Fortschrittsdaten:', e);
            return null;
        }
    }

    saveToStorage(data) {
        try {
            data.lastActivity = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Fehler beim Speichern der Fortschrittsdaten:', e);
        }
    }

    // Station Management
    saveStationResult(stationId, level, result) {
        const progress = this.getStoredProgress();
        
        if (!progress.stations[stationId]) {
            progress.stations[stationId] = {
                levels: {},
                firstAccess: new Date().toISOString(),
                totalAttempts: 0,
                bestPerformance: 0
            };
        }

        // Level-spezifische Daten speichern
        progress.stations[stationId].levels[level] = {
            ...result,
            completedAt: new Date().toISOString()
        };

        // Station-Statistiken aktualisieren
        progress.stations[stationId].totalAttempts++;
        progress.stations[stationId].lastAccess = new Date().toISOString();
        
        // Beste Performance tracken
        if (result.performanceScore > progress.stations[stationId].bestPerformance) {
            progress.stations[stationId].bestPerformance = result.performanceScore;
        }

        this.saveToStorage(progress);
    }

    getStationProgress(stationId) {
        const progress = this.getStoredProgress();
        return progress.stations[stationId] || null;
    }

    // Dashboard Data
    getAllStations() {
        const progress = this.getStoredProgress();
        
        return Object.values(this.stationDefinitions).map(station => {
            const stationProgress = progress.stations[station.id] || {};
            const levels = {};
            
            // Level-Status bestimmen
            for (let level = 1; level <= 3; level++) {
                const levelData = stationProgress.levels?.[level];
                if (levelData) {
                    levels[level] = {
                        status: levelData.score >= levelData.maxScore ? 'completed' : 'current',
                        score: levelData.score,
                        performance: levelData.performanceScore
                    };
                } else {
                    levels[level] = { status: '' };
                }
            }

            // Gesamt-Status der Station
            const completedLevels = Object.values(levels).filter(l => l.status === 'completed').length;
            let status = 'not-started';
            
            if (completedLevels > 0) {
                status = completedLevels === 3 ? 'completed' : 'in-progress';
            }

            // Empfehlungs-Status
            const recommendations = this.getRecommendations();
            if (recommendations.some(rec => rec.stationId === station.id && rec.priority === 'priority')) {
                status = 'recommended';
            }

            return {
                ...station,
                status: status,
                levels: levels,
                bestPerformance: stationProgress.bestPerformance || 0,
                attempts: stationProgress.totalAttempts || 0,
                lastAccess: stationProgress.lastAccess,
                estimatedTime: station.estimatedTime
            };
        });
    }

    getOverallStats() {
        const progress = this.getStoredProgress();
        const stations = Object.keys(this.stationDefinitions);
        
        let completedStations = 0;
        let totalScore = 0;
        let totalMaxScore = 0;
        let totalPerformance = 0;
        let performanceCount = 0;
        let totalTime = 0;

        stations.forEach(stationId => {
            const stationData = progress.stations[stationId];
            if (stationData) {
                const levels = Object.values(stationData.levels || {});
                const completedLevels = levels.filter(l => l.score >= l.maxScore);
                
                if (completedLevels.length === 3) {
                    completedStations++;
                }

                levels.forEach(level => {
                    totalScore += level.score || 0;
                    totalMaxScore += level.maxScore || 4;
                    
                    if (level.performanceScore !== undefined) {
                        totalPerformance += level.performanceScore;
                        performanceCount++;
                    }
                    
                    totalTime += level.timeSpent || 0;
                });
            }
        });

        return {
            completedStations: completedStations,
            totalStations: stations.length,
            overallProgress: Math.round((completedStations / stations.length) * 100),
            totalScore: totalScore,
            averagePerformance: performanceCount > 0 ? Math.round(totalPerformance / performanceCount) : 0,
            totalTime: totalTime
        };
    }

    // Recommendation System
    getRecommendations() {
        const progress = this.getStoredProgress();
        const path = this.learningPaths[progress.selectedPath || 'beginner'];
        const recommendations = [];

        // Prioritäts-Empfehlungen basierend auf Lernpfad
        const nextStation = this.getNextStationInPath();
        if (nextStation) {
            recommendations.push({
                stationId: nextStation,
                priority: 'priority',
                icon: '🚀',
                title: 'Empfohlen',
                description: `${this.stationDefinitions[nextStation].title} (${path.name})`
            });
        }

        // Stations mit begonnen aber nicht abgeschlossen
        Object.keys(this.stationDefinitions).forEach(stationId => {
            const stationProgress = progress.stations[stationId];
            if (stationProgress) {
                const levels = Object.values(stationProgress.levels || {});
                const completedLevels = levels.filter(l => l.score >= l.maxScore).length;
                
                if (completedLevels > 0 && completedLevels < 3) {
                    recommendations.push({
                        stationId: stationId,
                        priority: 'continue',
                        icon: '⏯️',
                        title: 'Fortsetzen',
                        description: `${this.stationDefinitions[stationId].title} - ${completedLevels}/3 Level abgeschlossen`
                    });
                }
            }
        });

        // Wiederholungs-Empfehlungen bei schlechter Performance
        Object.keys(progress.stations).forEach(stationId => {
            const stationData = progress.stations[stationId];
            if (stationData.bestPerformance < 60) {
                recommendations.push({
                    stationId: stationId,
                    priority: 'review',
                    icon: '🔄',
                    title: 'Wiederholen',
                    description: `${this.stationDefinitions[stationId].title} - Performance verbessern`
                });
            }
        });

        // Fallback: Erste Station falls noch nichts gemacht
        if (recommendations.length === 0) {
            recommendations.push({
                stationId: 'A',
                priority: 'priority',
                icon: '🚀',
                title: 'Starte hier',
                description: 'Station A - Terme zusammenfassen'
            });
        }

        return recommendations;
    }

    getNextStationInPath() {
        const progress = this.getStoredProgress();
        const path = this.learningPaths[progress.selectedPath || 'beginner'];
        
        if (path.sequence.length === 0) return null; // Custom path

        for (const stationId of path.sequence) {
            const stationProgress = progress.stations[stationId];
            if (!stationProgress) return stationId;
            
            const levels = Object.values(stationProgress.levels || {});
            const completedLevels = levels.filter(l => l.score >= l.maxScore).length;
            
            if (completedLevels < 3) return stationId;
        }

        return null; // Alle Stationen abgeschlossen
    }

    // SOS Help System
    getSOSSuggestions() {
        const progress = this.getStoredProgress();
        const suggestions = [];

        // Analysiere wo Schüler Probleme haben
        Object.keys(progress.stations).forEach(stationId => {
            const stationData = progress.stations[stationId];
            if (stationData && stationData.bestPerformance < 50) {
                // Empfehle einfachere Stationen
                const prerequisites = this.stationDefinitions[stationId].prerequisites;
                prerequisites.forEach(prereq => {
                    suggestions.push({
                        stationId: prereq,
                        title: `Grundlagen festigen`,
                        reason: `Station ${prereq} nochmal üben hilft bei Station ${stationId}`
                    });
                });
            }
        });

        // Standard-Hilfe wenn keine spezifischen Probleme
        if (suggestions.length === 0) {
            suggestions.push({
                stationId: 'A',
                title: 'Bei Grundlagen anfangen',
                reason: 'Station A schafft die Basis für alle anderen Stationen'
            });
        }

        return suggestions;
    }

    // Path Management
    setSelectedPath(pathType) {
        const progress = this.getStoredProgress();
        progress.selectedPath = pathType;
        this.saveToStorage(progress);
    }

    // Session Management
    generateSessionURL() {
        const progress = this.getStoredProgress();
        const compressedData = this.compressProgressData(progress);
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?session=${compressedData}`;
    }

    loadFromSession(sessionData) {
        try {
            const decompressedData = this.decompressProgressData(sessionData);
            this.saveToStorage(decompressedData);
            return true;
        } catch (e) {
            console.error('Fehler beim Laden der Session:', e);
            return false;
        }
    }

    compressProgressData(data) {
        // Vereinfachte Kompression - könnte mit LZ-String verbessert werden
        return btoa(JSON.stringify(data));
    }

    decompressProgressData(compressedData) {
        return JSON.parse(atob(compressedData));
    }

    // Export Functions
    exportAllResults() {
        const progress = this.getStoredProgress();
        const stats = this.getOverallStats();
        const timestamp = new Date().toISOString().split('T')[0];

        const exportData = {
            exportInfo: {
                exportDate: new Date().toISOString(),
                studentName: 'Unbekannt', // Könnte von Benutzer eingegeben werden
                className: 'Klasse 6',
                subject: 'Mathematik - Terme und Gleichungen'
            },
            overallStats: stats,
            detailedResults: this.getAllStations().map(station => ({
                stationId: station.id,
                title: station.title,
                status: station.status,
                bestPerformance: station.bestPerformance,
                attempts: station.attempts,
                levels: station.levels,
                timeSpent: this.getTotalTimeForStation(station.id)
            })),
            learningPath: {
                selectedPath: progress.selectedPath,
                pathName: this.learningPaths[progress.selectedPath]?.name || 'Unbekannt'
            },
            recommendations: this.getRecommendations(),
            rawData: progress
        };

        // JSON Export
        this.downloadJSON(exportData, `Mathe6-Gesamtergebnis-${timestamp}.json`);

        // Zusätzlich: Zusammenfassung als lesbarer Text
        const summary = this.generateTextSummary(exportData);
        this.downloadText(summary, `Mathe6-Zusammenfassung-${timestamp}.txt`);
    }

    getTotalTimeForStation(stationId) {
        const progress = this.getStoredProgress();
        const stationData = progress.stations[stationId];
        if (!stationData) return 0;

        return Object.values(stationData.levels || {})
            .reduce((total, level) => total + (level.timeSpent || 0), 0);
    }

    generateTextSummary(exportData) {
        const { overallStats, detailedResults, learningPath } = exportData;
        
        return `
MATHEMATIK LERNFORTSCHRITT - ZUSAMMENFASSUNG
============================================

Datum: ${new Date().toLocaleDateString('de-DE')}
Fach: Mathematik - Terme und Gleichungen (Klasse 6)

GESAMTÜBERSICHT:
- Abgeschlossene Stationen: ${overallStats.completedStations} von ${overallStats.totalStations}
- Gesamtfortschritt: ${overallStats.overallProgress}%
- Durchschnittliche Performance: ${overallStats.averagePerformance}%
- Gesamte Lernzeit: ${Math.round(overallStats.totalTime / 60)} Minuten
- Gewählter Lernpfad: ${learningPath.pathName}

STATIONEN IM DETAIL:
${detailedResults.map(station => `
${station.title}:
  Status: ${station.status}
  Beste Performance: ${station.bestPerformance}%
  Versuche: ${station.attempts}
  Zeit: ${Math.round(station.timeSpent / 60)} Minuten
  Level-Details: ${Object.entries(station.levels).map(([level, data]) => 
    `Level ${level}: ${data.status || 'nicht bearbeitet'}`
  ).join(', ')}
`).join('')}

EMPFEHLUNGEN:
${exportData.recommendations.map(rec => `- ${rec.title}: ${rec.description}`).join('\n')}
        `.trim();
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    }

    downloadText(text, filename) {
        const blob = new Blob([text], { type: 'text/plain; charset=utf-8' });
        this.downloadBlob(blob, filename);
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Reset Functions
    resetAllProgress() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }

    resetStation(stationId) {
        const progress = this.getStoredProgress();
        if (progress.stations[stationId]) {
            delete progress.stations[stationId];
            this.saveToStorage(progress);
        }
    }

    // Utility Functions
    getStationData(stationId) {
        return this.stationDefinitions[stationId] || null;
    }

    loadProgress() {
        // Wird von der HTML-Seite aufgerufen um sicherzustellen dass Daten geladen sind
        return this.getStoredProgress();
    }
}