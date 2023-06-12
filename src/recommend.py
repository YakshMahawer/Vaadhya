import sys
import json
import pickle
import pandas as pd

songs = pd.read_csv('trialball.csv')
id = str(sys.argv[1])
similarity = pickle.load(open('similarities.pkl', 'rb'))

def rec(songid):
    song_index = songs[songs['_id'] == songid].index[0]
    song_list = sorted(list(enumerate(similarity[song_index])), reverse = True, key = lambda x:x[1])[1:6]
    
    for i in song_list:
        print(songs.iloc[i[0]]._id)

rec(id)