// import { Component, OnInit } from '@angular/core';
// import { HelloService } from './hello.service';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './app.component.html',
// })

// export class AppComponent implements OnInit{
//   backendMessage: string = '';
  
//   constructor(private helloService: HelloService){}

//   ngOnInit() {
//     this.helloService.getHello().subscribe({
//       next: (msg) => this.backendMessage = msg,
//       error: (err) => this.backendMessage = 'Error connecting to backend'
//     });
//   }
// }




//DAY-5
// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms'; // Needed for [(ngModel)]
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import * as L from 'leaflet';


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterModule, FormsModule, LeafletModule],
//   templateUrl: './app.component.html',
// })

// export class AppComponent implements OnInit {
//   backendMessage: string = '';
//   backendResponse: string = '';
//   map: L.Map | null = null;

//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     // Example helloService logic (comment this out if not used anymore)
//     // this.helloService.getHello().subscribe({
//     //   next: (msg) => this.backendMessage = msg,
//     //   error: (err) => this.backendMessage = 'Error connecting to backend'
//     // });
//   }

//   onMapReady(map: L.Map) {
//     this.map = map;
//   }

//   submitEllipse() {
//     this.http.post('http://localhost:8080/ellipse', this.ellipseInput, { responseType: 'text' })
//       .subscribe({
//         next: (response) => {
//           this.backendResponse = response;
//           console.log('Ellipse data sent successfully.');

//           // Optional: Pan to ellipse center
//           if (this.map) {
//             const latLng = L.latLng(this.ellipseInput.centerY, this.ellipseInput.centerX);
//             this.map.panTo(latLng);

//             // Show a circle as a placeholder (Bezier curve later)
//             L.circle(latLng, {
//               radius: Math.max(this.ellipseInput.semiMajor, this.ellipseInput.semiMinor) * 1000,
//               color: 'blue',
//               fillOpacity: 0.2
//             }).addTo(this.map);
//           }
//         },
//         error: (error) => {
//           console.error('Error:', error);
//           this.backendResponse = 'Failed to send data to backend.';
//         }
//       });
//   }
// }




//DAY-5

// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import * as L from 'leaflet';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterModule, FormsModule, LeafletModule],
//   templateUrl: './app.component.html',
// })
// export class AppComponent implements OnInit {
//   backendMessage: string = '';
//   backendResponse: string = '';

//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   map: L.Map | null = null;

//   options: L.MapOptions = {
//     layers: [
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors',
//       }),
//     ],
//     zoom: 7,
//     center: L.latLng(20.5937, 78.9629), // India
//   };

//   constructor(private http: HttpClient) {}

//   ngOnInit() {}

//   onMapReady(mapInstance: L.Map) {
//     this.map = mapInstance;
//   }

//   submitEllipse() {
//     this.http.post('http://localhost:8080/ellipse', this.ellipseInput, { responseType: 'text' })
//       .subscribe({
//         next: (response) => {
//           this.backendResponse = response;
//           console.log('Ellipse data sent successfully.');

//           if (this.map) {
//             const latLngCenter = L.latLng(this.ellipseInput.centerY, this.ellipseInput.centerX);
//             this.map.panTo(latLngCenter);

//             // 🧹 Remove previous ellipse curves
//             this.map.eachLayer((layer) => {
//               if ((layer as any)._path) {
//                 this.map!.removeLayer(layer);
//               }
//             });

//             // 🔴 Draw Bezier ellipse
//             const bezierSegments = this.generateBezierEllipse(
//               this.ellipseInput.centerY,
//               this.ellipseInput.centerX,
//               this.ellipseInput.semiMajor,
//               this.ellipseInput.semiMinor
//             );

//             for (const segment of bezierSegments) {
//               L.polyline(segment, { color: 'red', weight: 2 }).addTo(this.map!);
//             }
//           }
//         },
//         error: (error) => {
//           console.error('Error:', error);
//           this.backendResponse = 'Failed to send data to backend.';
//         }
//       });
//   }

//   generateBezierEllipse(centerLat: number, centerLng: number, a: number, b: number): L.LatLng[][] {
//     const kappa = 0.552284749831;
//     const latConv = 1 / 111;
//     const lngConv = 1 / (111 * Math.cos(centerLat * Math.PI / 180));

//     const cp = (dx: number, dy: number) =>
//       L.latLng(centerLat + dy * latConv, centerLng + dx * lngConv);

//     const segments: L.LatLng[][] = [];

//     segments.push([
//       cp(-a, 0),
//       cp(-a, b * kappa),
//       cp(-a * kappa, b),
//       cp(0, b),
//     ]);
//     segments.push([
//       cp(0, b),
//       cp(a * kappa, b),
//       cp(a, b * kappa),
//       cp(a, 0),
//     ]);
//     segments.push([
//       cp(a, 0),
//       cp(a, -b * kappa),
//       cp(a * kappa, -b),
//       cp(0, -b),
//     ]);
//     segments.push([
//       cp(0, -b),
//       cp(-a * kappa, -b),
//       cp(-a, -b * kappa),
//       cp(-a, 0),
//     ]);
  
//     return segments;
//   }
// }






// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import * as L from 'leaflet';
// import { CommonModule } from '@angular/common';


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterModule, FormsModule, LeafletModule, CommonModule],
//   templateUrl: './app.component.html',
// })
// export class AppComponent implements OnInit {
//   backendMessage: string = '';
//   backendResponse: string = '';

//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   map: L.Map | null = null;

//   options: L.MapOptions = {
//     layers: [
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors',
//       }),
//     ],
//     zoom: 7,
//     center: L.latLng(20.5937, 78.9629), // India
//   };

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     console.log('L:', L);
//     console.log('L.Editable:', (L as any).Editable);
//     (L.Map as any).mergeOptions({ editable: true });
//   }

//   onMapReady(mapInstance: L.Map) {
//     this.map = mapInstance;
//     (this.map as any).editable = true;
//   }


// submitEllipse() {
//   this.http.post<any>('http://localhost:8080/bezier', this.ellipseInput)
//     .subscribe({
//       next: (response) => {
//         console.log('Backend Bézier points:', response);
//         this.backendResponse = 'Bezier curve data received.';

//         const bezierCoords = response.bezierCurve; // List of [lng, lat] pairs

//         if (this.map) {
//           const center = L.latLng(this.ellipseInput.centerY, this.ellipseInput.centerX);
//           this.map.panTo(center);

//           // 🧹 Remove old curves
//           this.map.eachLayer((layer) => {
//             if ((layer as any)._path) {
//               this.map!.removeLayer(layer);
//             }
//           });

//           // 🔴 Draw Bézier curve from backend using Editable
//           const latLngs = bezierCoords.map((point: number[]) =>
//             L.latLng(point[1], point[0]) // [lng, lat] → L.latLng(lat, lng)
//           );

//           const line = (this.map as any).editTools.createPolyline(latLngs, {
//             color: 'red',
//             weight: 2
//           });

//           line.addTo(this.map); // ✅ Add to map!
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier curve:', err);
//         this.backendResponse = 'Failed to fetch Bézier curve.';
//       }
//     });
// }

  

// }

//16 JUNE 2025 (up)



// import GeoTIFF from 'geotiff';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule, LeafletModule, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  backendMessage: string = '';
  backendResponse: string = '';

  ellipseInput = {
    semiMajor: 0,
    semiMinor: 0,
    centerX: 0,
    centerY: 0,
  };

  map: L.Map | null = null;

  options: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
    zoom: 7,
    center: L.latLng(20.5937, 78.9629),
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('L:', L);
    console.log('L.Editable:', (L as any).Editable);
    setTimeout(() => {
  console.log('L.Editable:', (L as any).Editable);
  if (!(L as any).Editable) {
    console.error('❌ leaflet-editable is NOT loaded — check angular.json and script file');
  }
}, 500);

    if (!(L as any).Editable) {
      console.error('❌ leaflet-editable is NOT loaded — check angular.json and script file');
    }
  }

  onMapReady(mapInstance: L.Map) {
    this.map = mapInstance;

    // Inject editable mode and init tools
    (this.map as any).options.editable = true;
    if (!(this.map as any).editTools && (L as any).Editable) {
      (this.map as any).editTools = new (L as any).Editable(this.map);
    }

    if ((this.map as any).editTools) {
      console.log('✅ editTools loaded:', (this.map as any).editTools);
    } else {
      console.warn('⚠️ editTools is still undefined. Check leaflet.editable.js inclusion.');
    }
  }

  submitEllipse() {
    this.http.post<any>('http://localhost:8080/bezier', this.ellipseInput).subscribe({
      next: (response) => {
        console.log('Backend Bézier points:', response);
        this.backendResponse = 'Bezier curve data received.';

        const bezierCoords = response.bezierCurve;

        if (this.map) {
          const center = L.latLng(this.ellipseInput.centerY, this.ellipseInput.centerX);
          this.map.panTo(center);

          // Optionally remove old SVG paths
          this.map.eachLayer((layer) => {
            if ((layer as any)._path) {
              this.map!.removeLayer(layer);
            }
          });

          const latLngs = bezierCoords.map((point: number[]) =>
            L.latLng(point[1], point[0])
          );

          const editTools = (this.map as any).editTools;
          if (editTools && typeof editTools.startPolyline === 'function') {
            const line = editTools.startPolyline(latLngs, {
              color: 'red',
              weight: 2,
            });
            (line as any).enableEdit(); // enable editing
          } else {
            console.error('❌ editTools or startPolyline not available.');
          }
        }
      },
      error: (err) => {
        console.error('Error fetching Bézier curve:', err);
        this.backendResponse = 'Failed to fetch Bézier curve.';
      },
    });
  }
}


//17 June 2025(up)(working fine(but no elevation data))




// import * as GeoTIFF from 'geotiff';
// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import * as L from 'leaflet';
// import { CommonModule } from '@angular/common';

// type TypedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterModule, FormsModule, LeafletModule, CommonModule],
//   templateUrl: './app.component.html',
// })
// export class AppComponent implements OnInit {
//   backendMessage: string = '';
//   backendResponse: string = '';

//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   map: L.Map | null = null;

//   options: L.MapOptions = {
//     layers: [
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors',
//       }),
//     ],
//     zoom: 7,
//     center: L.latLng(20.5937, 78.9629),
//   };

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     console.log('L:', L);
//     console.log('L.Editable:', (L as any).Editable);

//     setTimeout(() => {
//       console.log('L.Editable (delayed):', (L as any).Editable);
//       if (!(L as any).Editable) {
//         console.error('❌ leaflet-editable is NOT loaded — check angular.json and script file');
//       }
//     }, 500);
//   }

//   onMapReady(mapInstance: L.Map) {
//     this.map = mapInstance;
//     (this.map as any).options.editable = true;

//     if (!(this.map as any).editTools && (L as any).Editable) {
//       (this.map as any).editTools = new (L as any).Editable(this.map);
//     }

//     if ((this.map as any).editTools) {
//       console.log('✅ editTools loaded:', (this.map as any).editTools);
//     } else {
//       console.warn('⚠️ editTools is still undefined. Check leaflet.editable.js inclusion.');
//     }
//   }

//   async getElevation(lat: number, lon: number): Promise<number | null> {
//     try {
//       const response = await fetch('assets/data/india-elevation.tif');
//       const arrayBuffer = await response.arrayBuffer();
//       const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
//       const image = await tiff.getImage();

//       const bbox = image.getBoundingBox(); // [minX, minY, maxX, maxY]
//       const width = image.getWidth();
//       const height = image.getHeight();
//       const rasters = await image.readRasters({ interleave: false }) as (number[] | TypedArray)[];


//       const xRes = (bbox[2] - bbox[0]) / width;
//       const yRes = (bbox[3] - bbox[1]) / height;

//       const pixelX = Math.floor((lon - bbox[0]) / xRes);
//       const pixelY = Math.floor((bbox[3] - lat) / yRes);

//       if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height) {
//         return null;
//       }

//       const index = pixelY * width + pixelX;
//       return (rasters[0] as TypedArray)[index];
//     } catch (error) {
//       console.error('Failed to read elevation:', error);
//       return null;
//     }
//   }

//   async submitEllipse() {
//     const { centerY, centerX, semiMajor, semiMinor } = this.ellipseInput;
//     const elevation = await this.getElevation(centerY, centerX);
//     console.log('🗻 Elevation at center:', elevation);

//     // Distortion logic: adjust based on elevation (if found)
//     const distortionFactor = elevation ? elevation / 2000 : 0;
//     const adjustedMajor = semiMajor * (1 + distortionFactor);
//     const adjustedMinor = semiMinor * (1 - distortionFactor);

//     const adjustedInput = {
//       semiMajor: adjustedMajor,
//       semiMinor: adjustedMinor,
//       centerX,
//       centerY,
//     };

//     this.http.post<any>('http://localhost:8080/bezier', adjustedInput).subscribe({
//       next: (response) => {
//         console.log('Backend Bézier points:', response);
//         this.backendResponse = 'Bezier curve data received.';

//         const bezierCoords = response.bezierCurve;

//         if (this.map) {
//           const center = L.latLng(centerY, centerX);
//           this.map.panTo(center);

//           this.map.eachLayer((layer) => {
//             if ((layer as any)._path) {
//               this.map!.removeLayer(layer);
//             }
//           });

//           const latLngs = bezierCoords.map((point: number[]) =>
//             L.latLng(point[1], point[0])
//           );

//           const editTools = (this.map as any).editTools;
//           if (editTools && typeof editTools.startPolyline === 'function') {
//             const line = editTools.startPolyline(latLngs, {
//               color: 'red',
//               weight: 2,
//             });
//             (line as any).enableEdit();
//           } else {
//             console.error('❌ editTools or startPolyline not available.');
//           }
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier curve:', err);
//         this.backendResponse = 'Failed to fetch Bézier curve.';
//       },
//     });
//   }
// }


//18 JUNE 2025((up)WITH ELEVATION(but not working))