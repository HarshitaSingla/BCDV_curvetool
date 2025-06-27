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
//     center: L.latLng(20.5937, 78.9629),
//   };

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     console.log('L:', L);
//     console.log('L.Editable:', (L as any).Editable);
//     setTimeout(() => {
//   console.log('L.Editable:', (L as any).Editable);
//   if (!(L as any).Editable) {
//     console.error('❌ leaflet-editable is NOT loaded — check angular.json and script file');
//   }
// }, 500);

//     if (!(L as any).Editable) {
//       console.error('❌ leaflet-editable is NOT loaded — check angular.json and script file');
//     }
//   }

//   onMapReady(mapInstance: L.Map) {
//     this.map = mapInstance;

//     // Inject editable mode and init tools
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

//   submitEllipse() {
//     this.http.post<any>('http://localhost:8080/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         console.log('Backend Bézier points:', response);
//         this.backendResponse = 'Bezier curve data received.';

//         const bezierCoords = response.bezierCurve;

//         if (this.map) {
//           const center = L.latLng(this.ellipseInput.centerY, this.ellipseInput.centerX);
//           this.map.panTo(center);

//           // Optionally remove old SVG paths
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
//             (line as any).enableEdit(); // enable editing
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


//17 June 2025(up)(working very fine, has editability(but no elevation data))





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



// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import * as L from 'leaflet';
// import { CommonModule } from '@angular/common';

// interface EditablePolyline extends L.Polyline {
//   enableEdit?: () => void;
// }

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
//     this.loadLeafletEditableSafely();
//   }

//   loadLeafletEditableSafely() {
//     let attempts = 0;
//     const maxAttempts = 50;

//     const checkEditableLoaded = () => {
//       if ((L as any).Editable) {
//         console.log('✅ Leaflet.Editable is available.');
//       } else {
//         if (attempts < maxAttempts) {
//           attempts++;
//           console.warn(`⏳ Waiting for Leaflet.Editable... attempt ${attempts}`);
//           setTimeout(checkEditableLoaded, 200);
//         } else {
//           console.error('❌ Leaflet.Editable failed to load after max attempts.');
//         }
//       }
//     };

//     checkEditableLoaded();
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

//   submitEllipse() {
//     this.http.post<any>('http://localhost:8080/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         this.backendResponse = 'Bezier curve data received.';
//         const bezierSegments = response.bezierCurve;

//         console.log('Raw bezierCurve:', JSON.stringify(bezierSegments));

//         if (!this.map) return;

//         // Remove existing non-tile layers
//         this.map.eachLayer((layer) => {
//           if ((layer as any)._path || (layer as any) instanceof L.Polyline) {
//             if (!(layer as any)._url) {
//               this.map!.removeLayer(layer);
//             }
//           }
//         });

//         const editTools = (this.map as any).editTools;
//         if (!editTools || typeof editTools.startPolyline !== 'function') {
//           console.error('❌ editTools or startPolyline not available.');
//           return;
//         }

//         const allLatLngs: L.LatLng[] = [];

//         const zoom = this.map.getZoom();

//         // ✅ Fewer points: spacing is better even when zoomed out
//         const steps = Math.max(4, Math.floor(zoom * 1.5)); // Previously: zoom * 4

//         bezierSegments.forEach((segment: any, index: number) => {
//           if (!Array.isArray(segment) || segment.length !== 4) {
//             console.warn(`Skipping invalid segment [${index}]`, segment);
//             return;
//           }

//           const interpolated = this.interpolateBezier(segment, steps);
//           const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
//           allLatLngs.push(...latLngs);

//           const line = editTools.startPolyline(latLngs, {
//             color: 'red', // 🔴 restored red color
//             weight: 2,
//           }) as EditablePolyline;

//           line.enableEdit?.();
//         });

//         if (allLatLngs.length > 0) {
//           const bounds = L.latLngBounds(allLatLngs);
//           this.map.fitBounds(bounds, { padding: [20, 20] });
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier segments:', err);
//         this.backendResponse = 'Failed to fetch Bézier segments.';
//       },
//     });
//   }

//   interpolateBezier(points: number[][], steps: number): number[][] {
//     const result: number[][] = [];
//     for (let i = 0; i <= steps; i++) {
//       const t = i / steps;
//       const x = this.cubicBezier(t, points[0][0], points[1][0], points[2][0], points[3][0]);
//       const y = this.cubicBezier(t, points[0][1], points[1][1], points[2][1], points[3][1]);
//       result.push([x, y]);
//     }

//     // 🧹 Optional: filter out closely spaced points (distance threshold in meters)
//     const minDist = 5000; // Adjust this to control visual spacing (in meters)
//     return this.filterClosePoints(result, minDist);
//   }

//   filterClosePoints(points: number[][], minDistMeters: number): number[][] {
//     if (points.length === 0) return [];

//     const filtered: number[][] = [points[0]];
//     let last = L.latLng(points[0][1], points[0][0]);

//     for (const [x, y] of points.slice(1)) {
//       const current = L.latLng(y, x);
//       if (last.distanceTo(current) >= minDistMeters) {
//         filtered.push([x, y]);
//         last = current;
//       }
//     }

//     return filtered;
//   }

//   cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
//     const oneMinusT = 1 - t;
//     return (
//       oneMinusT ** 3 * p0 +
//       3 * oneMinusT ** 2 * t * p1 +
//       3 * oneMinusT * t ** 2 * p2 +
//       t ** 3 * p3
//     );
//   }
// }


//20 june 2025 (full ellipse(editable too))






// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import * as L from 'leaflet';
// import { CommonModule } from '@angular/common';
// import { EllipseService } from './ellipse.service'; // ✅ import service

// interface EditablePolyline extends L.Polyline {
//   enableEdit?: () => void;
// }

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

//   constructor(private http: HttpClient, private ellipseService: EllipseService) {} // ✅ inject service

//   ngOnInit() {
//     this.loadLeafletEditableSafely();
//   }

//   loadLeafletEditableSafely() {
//     let attempts = 0;
//     const maxAttempts = 50;
//     const checkEditableLoaded = () => {
//       if ((L as any).Editable) {
//         console.log('✅ Leaflet.Editable is available.');
//       } else {
//         if (attempts < maxAttempts) {
//           attempts++;
//           console.warn(`⏳ Waiting for Leaflet.Editable... attempt ${attempts}`);
//           setTimeout(checkEditableLoaded, 200);
//         } else {
//           console.error('❌ Leaflet.Editable failed to load after max attempts.');
//         }
//       }
//     };
//     checkEditableLoaded();
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

//   submitEllipse() {
//     this.http.post<any>('http://localhost:8080/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         this.backendResponse = 'Bezier curve data received.';
//         const bezierSegments = response.bezierCurve;

//         console.log('Raw bezierCurve:', JSON.stringify(bezierSegments));
//         if (!this.map) return;

//         this.map.eachLayer((layer) => {
//           if ((layer as any)._path || (layer as any) instanceof L.Polyline) {
//             if (!(layer as any)._url) {
//               this.map!.removeLayer(layer);
//             }
//           }
//         });

//         const editTools = (this.map as any).editTools;
//         if (!editTools || typeof editTools.startPolyline !== 'function') {
//           console.error('❌ editTools or startPolyline not available.');
//           return;
//         }

//         const allLatLngs: L.LatLng[] = [];
//         const zoom = this.map.getZoom();
//         const steps = Math.max(4, Math.floor(zoom * 1.5));

//         bezierSegments.forEach((segment: any, index: number) => {
//           if (!Array.isArray(segment) || segment.length !== 4) {
//             console.warn(`Skipping invalid segment [${index}]`, segment);
//             return;
//           }

//           const interpolated = this.interpolateBezier(segment, steps);
//           const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
//           allLatLngs.push(...latLngs);

//           const line = editTools.startPolyline(latLngs, {
//             color: 'red',
//             weight: 2,
//           }) as EditablePolyline;

//           line.enableEdit?.();

//           // ✅ Check elevation for each key point
//           latLngs.forEach((point) => this.checkElevation(point.lat, point.lng));
//         });

//         if (allLatLngs.length > 0) {
//           const bounds = L.latLngBounds(allLatLngs);
//           this.map.fitBounds(bounds, { padding: [20, 20] });
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier segments:', err);
//         this.backendResponse = 'Failed to fetch Bézier segments.';
//       },
//     });
//   }

//   checkElevation(lat: number, lon: number) {
//     this.ellipseService.getElevationStatus(lat, lon).subscribe({
//       next: (res) => {
//         if (!this.map) return;

//         const color = res.isSafe ? 'green' : 'red';

//         const circle = L.circleMarker([lat, lon], {
//           radius: 6,
//           color,
//           fillColor: color,
//           fillOpacity: 0.9,
//         });

//         circle.addTo(this.map!);
//       },
//       error: (err) => {
//         console.error(`Elevation check failed for (${lat}, ${lon}):`, err);
//       },
//     });
//   }

//   interpolateBezier(points: number[][], steps: number): number[][] {
//     const result: number[][] = [];
//     for (let i = 0; i <= steps; i++) {
//       const t = i / steps;
//       const x = this.cubicBezier(t, points[0][0], points[1][0], points[2][0], points[3][0]);
//       const y = this.cubicBezier(t, points[0][1], points[1][1], points[2][1], points[3][1]);
//       result.push([x, y]);
//     }
//     return this.filterClosePoints(result, 5000);
//   }

//   filterClosePoints(points: number[][], minDistMeters: number): number[][] {
//     if (points.length === 0) return [];

//     const filtered: number[][] = [points[0]];
//     let last = L.latLng(points[0][1], points[0][0]);

//     for (const [x, y] of points.slice(1)) {
//       const current = L.latLng(y, x);
//       if (last.distanceTo(current) >= minDistMeters) {
//         filtered.push([x, y]);
//         last = current;
//       }
//     }

//     return filtered;
//   }

//   cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
//     const oneMinusT = 1 - t;
//     return (
//       oneMinusT ** 3 * p0 +
//       3 * oneMinusT ** 2 * t * p1 +
//       3 * oneMinusT * t ** 2 * p2 +
//       t ** 3 * p3
//     );
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import * as L from 'leaflet';
// import { CommonModule } from '@angular/common';
// import { EllipseService } from './ellipse.service';

// interface EditablePolyline extends L.Polyline {
//   enableEdit?: () => void;
// }

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

//   constructor(private http: HttpClient, private ellipseService: EllipseService) {}

//   ngOnInit() {
//     this.loadLeafletEditableSafely();
//   }

//   loadLeafletEditableSafely() {
//     let attempts = 0;
//     const maxAttempts = 50;
//     const checkEditableLoaded = () => {
//       if ((L as any).Editable) {
//         console.log('✅ Leaflet.Editable is available.');
//       } else {
//         if (attempts < maxAttempts) {
//           attempts++;
//           console.warn(`⏳ Waiting for Leaflet.Editable... attempt ${attempts}`);
//           setTimeout(checkEditableLoaded, 200);
//         } else {
//           console.error('❌ Leaflet.Editable failed to load after max attempts.');
//         }
//       }
//     };
//     checkEditableLoaded();
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

//   submitEllipse() {
//     this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         this.backendResponse = 'Bezier curve data received.';
//         const bezierSegments = response.bezierCurve;

//         console.log('Raw bezierCurve:', JSON.stringify(bezierSegments));
//         if (!this.map) return;

//         this.map.eachLayer((layer) => {
//           if ((layer as any)._path || (layer as any) instanceof L.Polyline) {
//             if (!(layer as any)._url) {
//               this.map!.removeLayer(layer);
//             }
//           }
//         });

//         const editTools = (this.map as any).editTools;
//         if (!editTools || typeof editTools.startPolyline !== 'function') {
//           console.error('❌ editTools or startPolyline not available.');
//           return;
//         }

//         const allLatLngs: L.LatLng[] = [];
//         const zoom = this.map.getZoom();
//         const steps = Math.max(4, Math.floor(zoom * 1.5));

//         bezierSegments.forEach((segment: any, index: number) => {
//           if (!Array.isArray(segment) || segment.length !== 4) {
//             console.warn(`Skipping invalid segment [${index}]`, segment);
//             return;
//           }

//           const interpolated = this.interpolateBezier(segment, steps);
//           const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
//           allLatLngs.push(...latLngs);

//           const line = editTools.startPolyline(latLngs, {
//             color: 'red',
//             weight: 2,
//           }) as EditablePolyline;

//           line.enableEdit?.();

//           latLngs.forEach((point) => this.checkElevation(point.lat, point.lng));
//         });

//         if (allLatLngs.length > 0) {
//           const bounds = L.latLngBounds(allLatLngs);
//           this.map.fitBounds(bounds, { padding: [20, 20] });
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier segments:', err);
//         this.backendResponse = 'Failed to fetch Bézier segments.';
//       },
//     });
//   }

//   drawEllipse() {
//     if (!this.map) return;

//     const { centerX, centerY, semiMajor, semiMinor } = this.ellipseInput;
//     const center = L.latLng(centerY, centerX);

//     this.map.eachLayer((layer) => {
//       if ((layer as any)._path || (layer as any) instanceof L.Polyline || (layer as any) instanceof L.CircleMarker) {
//         if (!(layer as any)._url) {
//           this.map!.removeLayer(layer);
//         }
//       }
//     });

//     const ellipseLatLngs: L.LatLng[] = [];
//     for (let angle = 0; angle <= 360; angle += 5) {
//       const rad = (angle * Math.PI) / 180;
//       const dx = semiMajor * Math.cos(rad);
//       const dy = semiMinor * Math.sin(rad);

//       const lat = center.lat + (dy / 111000);
//       const lng = center.lng + (dx / (111000 * Math.cos(center.lat * Math.PI / 180)));

//       ellipseLatLngs.push(L.latLng(lat, lng));
//     }
//     ellipseLatLngs.push(ellipseLatLngs[0]);

//     const ellipsePolyline = L.polyline(ellipseLatLngs, {
//       color: 'blue',
//       weight: 2,
//       dashArray: '5,5',
//     }).addTo(this.map);

//     this.map.fitBounds(ellipsePolyline.getBounds());

//     this.plotInnerPoints(center, semiMajor, semiMinor, 30);
//   }

//   plotInnerPoints(center: L.LatLng, semiMajor: number, semiMinor: number, numPoints: number) {
//     for (let i = 0; i < numPoints; i++) {
//       const theta = 2 * Math.PI * Math.random();
//       const r = Math.sqrt(Math.random());

//       const x = r * semiMajor * Math.cos(theta);
//       const y = r * semiMinor * Math.sin(theta);

//       const lat = center.lat + (y / 111000);
//       const lng = center.lng + (x / (111000 * Math.cos(center.lat * Math.PI / 180)));

//       this.checkElevation(lat, lng);
//     }
//   }

//   checkElevation(lat: number, lon: number) {
//     this.ellipseService.getElevationStatus(lat, lon).subscribe({
//       next: (res) => {
//         if (!this.map) return;

//         const color = res.isSafe ? 'green' : 'red';

//         L.circleMarker([lat, lon], {
//           radius: 6,
//           color,
//           fillColor: color,
//           fillOpacity: 0.9,
//         }).addTo(this.map!);
//       },
//       error: (err) => {
//         console.error(`Elevation check failed for (${lat}, ${lon}):`, err);
//       },
//     });
//   }

//   interpolateBezier(points: number[][], steps: number): number[][] {
//     const result: number[][] = [];
//     for (let i = 0; i <= steps; i++) {
//       const t = i / steps;
//       const x = this.cubicBezier(t, points[0][0], points[1][0], points[2][0], points[3][0]);
//       const y = this.cubicBezier(t, points[0][1], points[1][1], points[2][1], points[3][1]);
//       result.push([x, y]);
//     }
//     return this.filterClosePoints(result, 5000);
//   }

//   filterClosePoints(points: number[][], minDistMeters: number): number[][] {
//     if (points.length === 0) return [];

//     const filtered: number[][] = [points[0]];
//     let last = L.latLng(points[0][1], points[0][0]);

//     for (const [x, y] of points.slice(1)) {
//       const current = L.latLng(y, x);
//       if (last.distanceTo(current) >= minDistMeters) {
//         filtered.push([x, y]);
//         last = current;
//       }
//     }

//     return filtered;
//   }

//   cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
//     const oneMinusT = 1 - t;
//     return (
//       oneMinusT ** 3 * p0 +
//       3 * oneMinusT ** 2 * t * p1 +
//       3 * oneMinusT * t ** 2 * p2 +
//       t ** 3 * p3
//     );
//   }
// }

//24 june (elevation working fine(but ellipse still gets drawn tryna fixing it))










import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { EllipseService } from './ellipse.service';

interface EditablePolyline extends L.Polyline {
  enableEdit?: () => void;
}

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

  constructor(private http: HttpClient, private ellipseService: EllipseService) {}

  ngOnInit() {
    this.loadLeafletEditableSafely();
  }

  loadLeafletEditableSafely() {
    let attempts = 0;
    const maxAttempts = 50;
    const checkEditableLoaded = () => {
      if ((L as any).Editable) {
        console.log('✅ Leaflet.Editable is available.');
      } else {
        if (attempts < maxAttempts) {
          attempts++;
          console.warn(`⏳ Waiting for Leaflet.Editable... attempt ${attempts}`);
          setTimeout(checkEditableLoaded, 200);
        } else {
          console.error('❌ Leaflet.Editable failed to load after max attempts.');
        }
      }
    };
    checkEditableLoaded();
  }

  onMapReady(mapInstance: L.Map) {
    this.map = mapInstance;
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
    this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
      next: (response) => {
        this.backendResponse = 'Bezier curve data received.';
        const bezierSegments = response.bezierCurve;

        console.log('Raw bezierCurve:', JSON.stringify(bezierSegments));
        if (!this.map) return;

        this.map.eachLayer((layer) => {
          if ((layer as any)._path || (layer as any) instanceof L.Polyline) {
            if (!(layer as any)._url) {
              this.map!.removeLayer(layer);
            }
          }
        });

        const editTools = (this.map as any).editTools;
        if (!editTools || typeof editTools.startPolyline !== 'function') {
          console.error('❌ editTools or startPolyline not available.');
          return;
        }

        const allLatLngs: L.LatLng[] = [];
        const zoom = this.map.getZoom();
        const steps = Math.max(4, Math.floor(zoom * 1.5));

        bezierSegments.forEach((segment: any, index: number) => {
          if (!Array.isArray(segment) || segment.length !== 4) {
            console.warn(`Skipping invalid segment [${index}]`, segment);
            return;
          }

          const interpolated = this.interpolateBezier(segment, steps);
          const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
          allLatLngs.push(...latLngs);

          const line = editTools.startPolyline(latLngs, {
            color: 'red',
            weight: 2,
          }) as EditablePolyline;

          line.enableEdit?.();

          latLngs.forEach((point) => this.checkElevation(point.lat, point.lng));
        });

        if (allLatLngs.length > 0) {
          const bounds = L.latLngBounds(allLatLngs);
          this.map.fitBounds(bounds, { padding: [20, 20] });
        }
      },
      error: (err) => {
        console.error('Error fetching Bézier segments:', err);
        this.backendResponse = 'Failed to fetch Bézier segments.';
      },
    });
  }

  drawEllipse() {
    if (!this.map) return;

    const { centerX, centerY, semiMajor, semiMinor } = this.ellipseInput;
    const center = L.latLng(centerY, centerX);

    // Step 1: Check center elevation before drawing
    this.ellipseService.getElevationStatus(center.lat, center.lng).subscribe({
      next: (res) => {
        if (!this.map) return;

        if (!res.isSafe) {
          // Only show red marker at center if unsafe
          L.circleMarker([center.lat, center.lng], {
            radius: 8,
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.9,
          }).addTo(this.map!);

          alert('❌ Elevation too high at center point! Ellipse not drawn.');
          return;
        }

        // Step 2: Safe – clear map layers
        this.map.eachLayer((layer) => {
          if ((layer as any)._path || (layer as any) instanceof L.Polyline || (layer as any) instanceof L.CircleMarker) {
            if (!(layer as any)._url) {
              this.map!.removeLayer(layer);
            }
          }
        });

        // Step 3: Add green center marker
        L.circleMarker([center.lat, center.lng], {
          radius: 8,
          color: 'green',
          fillColor: 'green',
          fillOpacity: 0.9,
        }).addTo(this.map);

        // Step 4: Draw ellipse shape
        const ellipseLatLngs: L.LatLng[] = [];
        for (let angle = 0; angle <= 360; angle += 5) {
          const rad = (angle * Math.PI) / 180;
          const dx = semiMajor * Math.cos(rad);
          const dy = semiMinor * Math.sin(rad);

          const lat = center.lat + (dy / 111000);
          const lng = center.lng + (dx / (111000 * Math.cos(center.lat * Math.PI / 180)));

          ellipseLatLngs.push(L.latLng(lat, lng));
        }
        ellipseLatLngs.push(ellipseLatLngs[0]);

        const ellipsePolyline = L.polyline(ellipseLatLngs, {
          color: 'blue',
          weight: 2,
          dashArray: '5,5',
        }).addTo(this.map);

        this.map.fitBounds(ellipsePolyline.getBounds());

        // Step 5: Plot internal elevation points
        this.plotInnerPoints(center, semiMajor, semiMinor, 30);
      },
      error: (err) => {
        console.error(`Elevation check failed for center (${center.lat}, ${center.lng}):`, err);
        alert('⚠️ Could not check elevation. Ellipse not drawn.');
      },
    });
  }

  plotInnerPoints(center: L.LatLng, semiMajor: number, semiMinor: number, numPoints: number) {
    for (let i = 0; i < numPoints; i++) {
      const theta = 2 * Math.PI * Math.random();
      const r = Math.sqrt(Math.random());

      const x = r * semiMajor * Math.cos(theta);
      const y = r * semiMinor * Math.sin(theta);

      const lat = center.lat + (y / 111000);
      const lng = center.lng + (x / (111000 * Math.cos(center.lat * Math.PI / 180)));

      this.checkElevation(lat, lng);
    }
  }

  checkElevation(lat: number, lon: number) {
    this.ellipseService.getElevationStatus(lat, lon).subscribe({
      next: (res) => {
        if (!this.map) return;

        const color = res.isSafe ? 'green' : 'red';

        L.circleMarker([lat, lon], {
          radius: 6,
          color,
          fillColor: color,
          fillOpacity: 0.9,
        }).addTo(this.map!);
      },
      error: (err) => {
        console.error(`Elevation check failed for (${lat}, ${lon}):`, err);
      },
    });
  }

  interpolateBezier(points: number[][], steps: number): number[][] {
    const result: number[][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = this.cubicBezier(t, points[0][0], points[1][0], points[2][0], points[3][0]);
      const y = this.cubicBezier(t, points[0][1], points[1][1], points[2][1], points[3][1]);
      result.push([x, y]);
    }
    return this.filterClosePoints(result, 5000);
  }

  filterClosePoints(points: number[][], minDistMeters: number): number[][] {
    if (points.length === 0) return [];

    const filtered: number[][] = [points[0]];
    let last = L.latLng(points[0][1], points[0][0]);

    for (const [x, y] of points.slice(1)) {
      const current = L.latLng(y, x);
      if (last.distanceTo(current) >= minDistMeters) {
        filtered.push([x, y]);
        last = current;
      }
    }

    return filtered;
  }

  cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const oneMinusT = 1 - t;
    return (
      oneMinusT ** 3 * p0 +
      3 * oneMinusT ** 2 * t * p1 +
      3 * oneMinusT * t ** 2 * p2 +
      t ** 3 * p3
    );
  }
}
