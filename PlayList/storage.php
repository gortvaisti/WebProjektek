<?php

class Storage {
    private $filePath;
    private $data;

    public function __construct($filePath) {
        $this->filePath = $filePath;
        if (file_exists($filePath)) {
            $this->data = json_decode(file_get_contents($filePath), true);
        } else {
            $this->data = [];
        }
    }

    public function getById($id) {
        if (isset($this->data[$id])) {
            return $this->data[$id];
        }
        return null;
    }

    public function searchByTrack($trackName) {
        $results = [];
        foreach ($this->data as $item) {
            if (stripos($item['title'], $trackName) !== false) {
                $results[] = $item;
            }
        }
        return $results;
    }

    public function searchByPlaylist($playlistName) {
        $results = [];
        foreach ($this->data as $item) {
            if ($item['name'] == $playlistName) {
                $results[] = $item;
            }
        }
        if (empty($results)) {
            throw new Exception("Nincs ilyen nevű lejátszási lista: " . $playlistName);
        }
        return $results;
    }

    public function searchByUser($username) {
        $results = [];
        foreach ($this->data as $item) {
            if ($item['username'] == $username) {
                $results[] = $item;
            }
        }
        return $results;
    }

    public function getUserPlaylists($userId) {
        $userPlaylists = [];
        
        foreach ($this->data as $id => $playlist) {
            if ($playlist['created_by'] === $userId) {
                $userPlaylists[] = $playlist;
            }
        }
    
        return $userPlaylists;
    }
    

    public function save($item) {
        $this->data[] = $item;
        file_put_contents($this->filePath, json_encode($this->data));
    }

    public function update($id, $item) {
        if (isset($this->data[$id])) {
            $this->data[$id] = $item;
            file_put_contents($this->filePath, json_encode($this->data, JSON_PRETTY_PRINT));
        } else {
            throw new Exception("nincs ilyen ID: " . $id);
        }
    }
}
?>
