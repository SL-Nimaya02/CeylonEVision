/**
 * CeylonEVision: Frontend Application Entry Point
 * 
 * This component orchestrates the application state, managing:
 * 1. User Context: Battery SoC, Optimization Preferences (Cost vs Time).
 * 2. Spatial Context: User GPS position and search destinations.
 * 3. AI Recommendations: Fetches and maps DRL-optimized station data.
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar, type StationRecommendation } from './components/RightSidebar';
import { BottomPanel } from './components/BottomPanel';
import { MapMap } from './components/MapMap';
import { ProjectInfoModal } from './components/ProjectInfoModal';


function App() {
  // --- CORE PREFERENCES ---
  const [soc, setSoc] = useState<number>(45); // Current State of Charge (%)
  const [isUrgent, setIsUrgent] = useState<boolean>(false); // Optimization: Minimize time
  const [isBudget, setIsBudget] = useState<boolean>(true); // Optimization: Minimize cost
  const [vehicleModel, setVehicleModel] = useState<string>("MG ZS EV (44.5kWh)"); // Vehicle Profile

  // --- SPATIAL STATE ---
  const [isResearchMode, setIsResearchMode] = useState<boolean>(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null); // Current [Lat, Lon]
  const [navDestination, setNavDestination] = useState<[number, number] | null>(null); // Targeted Station Coords

  // --- RECOMMENDATION ENGINE STATE ---
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<StationRecommendation | null>(null); // Top Recommendation
  const [otherRecommendations, setOtherRecommendations] = useState<StationRecommendation[]>([]); // Secondary Suggestions
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(''); // Research state for AI Mode

  /**
   * Geolocation Handler:
   * Requests browser-level GPS access to center the user position in the analytical context.
   */
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error detecting location:", error);
          alert("Could not detect location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  /**
   * Location Update Handler:
   * triggered by search input in LeftSidebar component.
   */
  const handleAddLocation = (lat: number, lng: number) => {
    setUserPosition([lat, lng]);
  };

  /**
   * Mapping Navigation Handler:
   * Updates the global destination state to trigger Leaflet routing on the map.
   */
  const handleNavigate = (coords: [number, number]) => {
    setNavDestination(coords);
    setIsRightSidebarOpen(false);
  };

  /**
   * Primary Recommendation Flow:
   * 1. Transmits user context (SoC, Priorities, Coordinates) to the Python Analytical Backend.
   * 2. Receives a list of DRL-ranked stations.
   * 3. Maps raw JSON metrics to the StationRecommendation frontend interface.
   */
  const handleShowStations = async () => {
    setIsSearching(true);
    setRecommendation(null);
    setOtherRecommendations([]);
    setIsRightSidebarOpen(true);
    setNavDestination(null);

    try {
      const response = await fetch("http://localhost:8000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: "Colombo",
          battery: soc,
          urgent: isUrgent,
          budget: isBudget,
          vehicle_model: vehicleModel,
          latitude: userPosition ? userPosition[0] : 6.9271,
          longitude: userPosition ? userPosition[1] : 79.8612
        }),
      });

      if (!response.ok) throw new Error('Analytical Backend failed to respond.');
      const data = await response.json();

      if (data.status === "success") {
        setMode(data.mode);
        if (data.recommendations && data.recommendations.length > 0) {
          const mappedStations: StationRecommendation[] = data.recommendations.map((item: any) => ({
            stationName: item.stationName,
            confidence: item.confidence,
            waitTime: item.waitTime,
            cost: item.cost,
            rating: 4.8,
            distance: item.distance,
            coordinates: [item.latitude, item.longitude],
            reason: item.reason,
            contact: item.contact,
            priceRate: item.priceRate,
            connector: item.connector,
            power: item.power,
            travelTime: item.travelTime,
            trafficStatus: item.trafficStatus,
            trafficColor: item.trafficColor,
            delay: item.delay,
            is_safety_choice: item.is_safety_choice
          }));

          setRecommendation(mappedStations[0]);
          setOtherRecommendations(mappedStations.slice(1));
        } else {
          alert("No suitable charging points identified.");
        }
      }
    } catch (error: any) {
      console.error("Critical Failure in Analytics Fetch:", error);
      alert(`Backend Communication Error: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden font-inter">
      {/* Dynamic Header Component */}
      <Header onOpenProjectInfo={() => setIsProjectInfoOpen(true)} />

      <main className="flex-1 flex overflow-hidden">
        {/* Input Interface: Controls preferences and geospatial search */}
        <LeftSidebar
          soc={soc}
          setSoc={setSoc}
          isUrgent={isUrgent}
          setIsUrgent={setIsUrgent}
          isBudget={isBudget}
          setIsBudget={setIsBudget}
          vehicleModel={vehicleModel}
          setVehicleModel={setVehicleModel}
          onLocateMe={handleLocateMe}
          onAddLocation={handleAddLocation}
          onShowStations={handleShowStations}
        />

        {/* Spatial Interface: Centered Leaflet Map with Real-time Analysis overlay */}
        <div className="flex-1 relative">
          <MapMap userPosition={userPosition} destination={navDestination} />
          <BottomPanel
            isResearchMode={isResearchMode}
            setIsResearchMode={setIsResearchMode}
          />
        </div>

        {/* Dashboard Interface: Displays AI results and station metrics */}
        <RightSidebar
          recommendation={recommendation}
          otherRecommendations={otherRecommendations}
          isLoading={isSearching}
          isOpen={isRightSidebarOpen}
          onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          onNavigate={handleNavigate}
          mode={mode}
        />
      </main>

      {/* Research Documentation Modal */}
      <ProjectInfoModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
      />
    </div>
  );
}

export default App;

