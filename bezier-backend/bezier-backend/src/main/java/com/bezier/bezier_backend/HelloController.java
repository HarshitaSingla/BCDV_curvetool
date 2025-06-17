// package com.bezier.bezier_backend;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// public class HelloController {

//     @GetMapping("/hello")
//     public String sayHello() {
//         return "HELLO, Backend is working!";
//     }
// }



//DAY-5
// package com.bezier.bezier_backend;

// import com.bezier.bezier_backend.model.EllipseInput;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular
// public class HelloController {

//     @GetMapping("/hello")
//     public String hello() {
//         return "Hello from Spring Boot backend!";
//     }

//     @PostMapping("/ellipse")
//     public String receiveEllipseData(@RequestBody EllipseInput input) {
//         return "Received ellipse with semiMajor: " + input.getSemiMajor() +
//                ", semiMinor: " + input.getSemiMinor() +
//                ", center: (" + input.getCenterX() + ", " + input.getCenterY() + ")";
//     }
// }




package com.bezier.bezier_backend;

import com.bezier.bezier_backend.model.EllipseInput;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot backend!";
    }

    @PostMapping("/ellipse")
    public String receiveEllipseData(@RequestBody EllipseInput input) {
        return "Received ellipse with semiMajor: " + input.getSemiMajor() +
               ", semiMinor: " + input.getSemiMinor() +
               ", center: (" + input.getCenterX() + ", " + input.getCenterY() + ")";
    }

    // ✅ New Endpoint
    @PostMapping("/bezier")
    public ResponseEntity<Map<String, List<List<Double>>>> getBezierCurve(@RequestBody EllipseInput input) {
        double a = input.getSemiMajor();
        double b = input.getSemiMinor();
        double cx = input.getCenterX();
        double cy = input.getCenterY();

        // Approximation coefficient for a quarter ellipse Bézier curve
        double k = 4 * (Math.sqrt(2) - 1) / 3;

        List<List<Double>> bezier = new ArrayList<>();
        bezier.add(Arrays.asList(cx + a, cy));             // P0
        bezier.add(Arrays.asList(cx + a, cy + k * b));     // P1
        bezier.add(Arrays.asList(cx + k * a, cy + b));     // P2
        bezier.add(Arrays.asList(cx, cy + b));             // P3

        Map<String, List<List<Double>>> response = new HashMap<>();
        response.put("bezierCurve", bezier);

        return ResponseEntity.ok(response);
    }
}


