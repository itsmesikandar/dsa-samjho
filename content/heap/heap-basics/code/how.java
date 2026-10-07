import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Main {
    // Min-heap: ek array mein complete tree. Index i ke bachche 2i+1, 2i+2; parent (i-1)/2
    static class MinHeap {
        private final List<Integer> a = new ArrayList<>();

        int size() {
            return a.size();
        }

        int peek() {
            return a.get(0); // sabse chhota hamesha root (index 0) par
        }

        void push(int x) {
            a.add(x); // aakhri khaali jagah par - shape complete rehti hai //@add
            int i = a.size() - 1;
            while (i > 0 && a.get((i - 1) / 2) > a.get(i)) { // parent bada hai - order toota //@cmpUp
                Collections.swap(a, i, (i - 1) / 2); // ek level upar chadho //@up
                i = (i - 1) / 2;
            }
        }

        int pop() {
            int top = a.get(0);
            int last = a.remove(a.size() - 1); // aakhri nikaalo - beech mein hole nahi banta //@last
            if (!a.isEmpty()) {
                a.set(0, last); // root par rakho, phir neeche push karo (sift down) //@root
                int i = 0;
                while (true) {
                    int l = 2 * i + 1, r = l + 1, m = i;
                    if (l < a.size() && a.get(l) < a.get(m)) m = l; // dono bachchon mein jo chhota //@pick
                    if (r < a.size() && a.get(r) < a.get(m)) m = r;
                    if (m == i) break; // bachche bade (ya hain hi nahi) - jagah mil gayi //@stop
                    Collections.swap(a, i, m); // chhota bachcha upar, ye neeche //@down
                    i = m;
                }
            }
            return top;
        }
    }

    public static void main(String[] args) {
        MinHeap h = new MinHeap();
        List<Integer> popped = new ArrayList<>();
        for (int x : new int[] {5, 3, 8, 2}) h.push(x);
        popped.add(h.pop());
        h.push(1);
        popped.add(h.pop());
        System.out.println(popped);
        System.out.println(h.peek() + " " + h.size());
    }
}

// Output:
// [2, 1]
// 3 3
