import java.util.ArrayDeque;
import java.util.Queue;

class Main {
    // Senators R aur D baari-baari bolte hain. Har ek kisi doosri party wale ka haq chheen sakta hai. Kaun jeetega?
    static String predictPartyVictory(String senate) {
        int n = senate.length();
        Queue<Integer> r = new ArrayDeque<>(); // R senators ki baari (index = kab bolega)
        Queue<Integer> d = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (senate.charAt(i) == 'R') r.offer(i);
            else d.offer(i);
        }
        while (!r.isEmpty() && !d.isEmpty()) {
            int ri = r.poll(); // dono parties ke agle senator aamne-saamne //@face
            int di = d.poll();
            if (ri < di) {
                r.offer(ri + n); // R pehle bola: D ka haq gaya; R agle round mein phir aayega //@rwin
            } else {
                d.offer(di + n); //@dwin
            }
        }
        return r.isEmpty() ? "Dire" : "Radiant";
    }

    public static void main(String[] args) {
        System.out.println(predictPartyVictory("RDD"));
        System.out.println(predictPartyVictory("RD"));
    }
}

// Output:
// Dire
// Radiant
