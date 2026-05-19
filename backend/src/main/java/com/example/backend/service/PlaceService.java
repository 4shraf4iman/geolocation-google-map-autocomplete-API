package com.example.backend.service;

import com.example.backend.model.Place;
import com.example.backend.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public Place savePlace(Place place) {
        // 3rd party API nested call requirement
        // Fetching current temperature from Open-Meteo API using the place's lat/lng
        try {
            String apiUrl = String.format(
                    "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current_weather=true",
                    place.getLat(), place.getLng());
            Map<String, Object> response = restTemplate.getForObject(apiUrl, Map.class);
            if (response != null && response.containsKey("current_weather")) {
                Map<String, Object> currentWeather = (Map<String, Object>) response.get("current_weather");
                place.setWeatherInfo("Current Temp: " + currentWeather.get("temperature") + "°C");
            }
        } catch (Exception e) {
            place.setWeatherInfo("Weather data unavailable");
        }

        Optional<Place> existing = placeRepository.findByPlaceId(place.getPlaceId());
        if (existing.isPresent()) {
            Place existingPlace = existing.get();
            existingPlace.setName(place.getName());
            existingPlace.setAddress(place.getAddress());
            existingPlace.setLat(place.getLat());
            existingPlace.setLng(place.getLng());
            existingPlace.setWeatherInfo(place.getWeatherInfo());
            return placeRepository.save(existingPlace);
        }

        return placeRepository.save(place); // Insert
    }

    @Transactional(readOnly = true)
    public Page<Place> getAllPlaces(Pageable pageable) {
        return placeRepository.findAll(pageable); // Get with pagination
    }

    @Transactional(readOnly = true)
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    @Transactional
    public void deleteByPlaceId(String placeId) {
        placeRepository.findByPlaceId(placeId).ifPresent(placeRepository::delete);
    }

    @Transactional
    public void deleteAllPlaces() {
        placeRepository.deleteAll();
    }

    @Transactional(readOnly = true)
    public Place getPlaceById(Long id) {
        return placeRepository.findById(id).orElse(null);
    }
}
