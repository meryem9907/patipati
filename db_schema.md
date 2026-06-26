
2. An animal spot contains information about environmental_threats / other_threats / other_info 
4. A nourishment has a an expiry_date, food_presence, water_presence
5. Environmental_threats can be heat, sharp_objects, cold, wind.
6. Other_threats is definied by animal_spot and other_threat.
7. Other_info is defined by animal_spot and other_info
9. An urgency_flag can be good_condition / needs_nourishment / needs_shelter / needs_veternary_care / needs_secure_env

animal_spot(animal_spot_id, last_seen_time, neighborhood, apartment, city, street_building, country, district, supply_id, animal_group_id, urgency_flag)
nourishment(supply_id, expiry_date, water_present, food_present)
animal(animal_id, breed, shelter_needed, adopted, animal_group_id)
injury(injury_id, injury, animal_id)
animal_group(animal_group_id, animal_spot, size)
registered(registered_id, email, password, name, admin_flag)
saved_animal_spots(registered_id, animal_spot, saved_at)