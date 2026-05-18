package com.example.backend.controller;

import com.example.backend.model.Place;
import com.example.backend.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*") // Allow any React Frontend port
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<Place> savePlace(@RequestBody Place place) {
        return ResponseEntity.ok(placeService.savePlace(place));
    }

    @GetMapping
    public ResponseEntity<Page<Place>> getAllPlaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(placeService.getAllPlaces(pageable));
    }
}
