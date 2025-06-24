import { TournamentsMap } from '@/components/tournaments/tournaments-map';
import { TournamentsFilter } from '@/components/tournaments/tournaments-filter';

export const metadata = {
  title: 'Carte des Tournois - SowEsport',
  description: 'Trouvez les tournois esports près de chez vous avec géolocalisation',
};

export default function TournamentsMapPage() {
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="text-purple-400">📍</span>
            Carte des Tournois
          </h1>
          <p className="text-gray-300 text-lg">
            Découvrez les événements esports autour de vous avec la géolocalisation
          </p>
        </div>
        
        {/* Filtres */}
        <div className="mb-6">
          <TournamentsFilter />
        </div>

        {/* Map Container */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="h-[70vh] min-h-[600px] relative">
            <TournamentsMap />
          </div>
        </div>

        {/* Info panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="font-semibold text-purple-400 mb-2">🎯 Géolocalisation</h3>
            <p className="text-gray-300">
              Autorisez la géolocalisation pour voir votre position et les distances.
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="font-semibold text-green-400 mb-2">🎮 Événements en temps réel</h3>
            <p className="text-gray-300">
              Les événements sont mis à jour automatiquement depuis notre base de données.
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="font-semibold text-orange-400 mb-2">🗺️ Navigation</h3>
            <p className="text-gray-300">
              Cliquez sur un marqueur pour obtenir l'itinéraire vers l'événement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}