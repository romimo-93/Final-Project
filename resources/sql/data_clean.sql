-- See if there are duplicates
select game_id, player_id, count(*)
from game_skater_stats_new
group by game_id, player_id
HAVING count(*) > 1
  
-- Add a serial primary key
ALTER TABLE game_skater_stats ADD COLUMN id SERIAL PRIMARY KEY

-- Remove the duplicates
DELETE FROM game_skater_stats a USING game_skater_stats b
WHERE a.id < b.id AND a.game_id = b.game_id AND a.player_id = b.player_id;