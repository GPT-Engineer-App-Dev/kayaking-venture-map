import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import "leaflet/dist/leaflet.css";

const defaultCenter = [51.505, -0.09]; // London coordinates as default

const AddMarkerToClick = ({ addMarker }) => {
  useMapEvents({
    click(e) {
      addMarker(e.latlng);
    },
  });
  return null;
};

const Index = () => {
  const [trips, setTrips] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [tripForm, setTripForm] = useState({
    name: "",
    date: "",
    duration: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripForm((prev) => ({ ...prev, [name]: value }));
  };

  const addMarker = (latlng) => {
    setMarkers((prev) => [...prev, latlng]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (markers.length === 0) {
      alert("Please select a location on the map.");
      return;
    }
    const newTrip = {
      ...tripForm,
      id: Date.now(),
      location: markers[markers.length - 1],
    };
    setTrips((prev) => [...prev, newTrip]);
    setTripForm({ name: "", date: "", duration: "", description: "" });
    setMarkers([]);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Kayaking Trip Planner</h1>
        <p className="text-xl text-gray-600">Plan your perfect kayaking adventure</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Map</CardTitle>
            </CardHeader>
            <CardContent>
              <MapContainer center={defaultCenter} zoom={13} style={{ height: "400px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <AddMarkerToClick addMarker={addMarker} />
                {markers.map((position, idx) => (
                  <Marker key={`marker-${idx}`} position={position} draggable={true}>
                    <Popup>Trip location</Popup>
                  </Marker>
                ))}
                {trips.map((trip) => (
                  <Marker key={trip.id} position={trip.location}>
                    <Popup>{trip.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Trip Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={tripForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={tripForm.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={tripForm.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={tripForm.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit">Save Trip</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Saved Trips</CardTitle>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <p>No trips saved yet.</p>
          ) : (
            <ul className="space-y-4">
              {trips.map((trip) => (
                <li key={trip.id} className="border-b pb-2">
                  <h3 className="font-bold">{trip.name}</h3>
                  <p>Date: {trip.date}</p>
                  <p>Duration: {trip.duration} hours</p>
                  <p>{trip.description}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;