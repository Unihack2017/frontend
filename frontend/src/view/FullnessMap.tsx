import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { tileLayer, map, LatLng, geoJSON} from 'leaflet';
import './FullnessMap.css';
import PopUp from './PopUp';
import {mapState} from '../state/frontend-state';
@observer
class FullnessMap extends React.Component {
  public readonly tileLayer;
  public readonly roomLayer;
  public mapContainer;
  public map;
  constructor(props) {
    super(props);
    this.tileLayer = this.tileLayer = tileLayer(
      'http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Seat.Me</a>'
      }
    );
    this.roomLayer = geoJSON([], {
        style: (feature) => {
          const roomData = mapState.allRoomState.get(feature.properties.id);
          return {
            color: roomData.fullnessColor,
            weight: 1,
            opacity: 0.65
          }
        } 
      }).bindPopup((layer) => {
        const ref = document.createElement('div');
        ReactDOM.render(<PopUp id={layer.feature.properties.id}/>, ref);
        return ref;
      })
  }

  componentDidMount() {
    this.map = map(this.mapContainer, {
      center: new LatLng(-37.8163921, 144.9649125),
      zoom: 18,
      maxZoom: 20
    });
    this.tileLayer.addTo(this.map);
    this.roomLayer.addTo(this.map);
  }

  render() {
    this.roomLayer.clearLayers();
    this.roomLayer.addData(mapState.allRoomGeoData);
    return (
      <div
        className="map-container"
        ref={(mapContainer) => { this.mapContainer = mapContainer; }}
      >
      </div>
    );
  }
}
export default FullnessMap;
export { FullnessMap };