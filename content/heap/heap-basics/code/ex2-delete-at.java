import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Main {
    // Index k ka item hatao: aakhri item wahan rakho, phir upar YA neeche theek karo
    static void deleteAt(List<Integer> a, int k) {
        int last = a.remove(a.size() - 1); // aakhri jagah khaali karo - shape complete rahe //@last
        if (k == a.size()) return; // aakhri hi hatana tha //@end
        a.set(k, last); // chhed ko aakhri item se bharo //@put
        int i = k;
        while (i > 0 && a.get((i - 1) / 2) > a.get(i)) { // parent se chhota - upar chadho //@up
            Collections.swap(a, i, (i - 1) / 2);
            i = (i - 1) / 2;
        }
        while (true) { // bachchon se bada - neeche jao (dono loop mein se ek hi kaam karega)
            int l = 2 * i + 1, r = l + 1, m = i;
            if (l < a.size() && a.get(l) < a.get(m)) m = l;
            if (r < a.size() && a.get(r) < a.get(m)) m = r;
            if (m == i) break; // parent <= ye <= bachche: jagah pakki //@stop
            Collections.swap(a, i, m); //@down
            i = m;
        }
    }

    public static void main(String[] args) {
        List<Integer> h = new ArrayList<>(List.of(1, 10, 2, 11, 12, 3, 4));
        deleteAt(h, 4); // 12 hatao; aakhri 4 wahan aakar UPAR jaata hai
        System.out.println(h);
        deleteAt(h, 0); // root hatao = pop; aakhri 3 NEECHE jaata hai
        System.out.println(h);
    }
}

// Output:
// [1, 4, 2, 11, 10, 3]
// [2, 4, 3, 11, 10]
