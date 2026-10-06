import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

class Main {
    // Ek hi heap code min aur max dono ke liye: bas "kaun upar aaye" ka Comparator badlo
    static class Heap {
        private final List<Integer> a = new ArrayList<>();
        private final Comparator<Integer> cmp;

        Heap(Comparator<Integer> cmp) {
            this.cmp = cmp;
        }

        boolean isEmpty() {
            return a.isEmpty();
        }

        // a[i] ko a[j] se upar hona chahiye?
        private boolean before(int i, int j) {
            return cmp.compare(a.get(i), a.get(j)) < 0;
        }

        void push(int x) {
            a.add(x);
            int i = a.size() - 1;
            while (i > 0 && before(i, (i - 1) / 2)) {
                Collections.swap(a, i, (i - 1) / 2);
                i = (i - 1) / 2;
            }
        }

        int pop() {
            int top = a.get(0);
            int last = a.remove(a.size() - 1);
            if (!a.isEmpty()) {
                a.set(0, last);
                int i = 0;
                while (true) {
                    int l = 2 * i + 1, r = l + 1, m = i;
                    if (l < a.size() && before(l, m)) m = l;
                    if (r < a.size() && before(r, m)) m = r;
                    if (m == i) break;
                    Collections.swap(a, i, m);
                    i = m;
                }
            }
            return top;
        }
    }

    static List<Integer> drain(Heap h) {
        List<Integer> out = new ArrayList<>();
        while (!h.isEmpty()) out.add(h.pop());
        return out;
    }

    public static void main(String[] args) {
        Heap minH = new Heap(Comparator.naturalOrder()); // chhota upar
        Heap maxH = new Heap(Comparator.reverseOrder()); // bada upar
        for (int x : new int[] {5, 1, 8, 3, 9, 3}) {
            minH.push(x);
            maxH.push(x);
        }
        System.out.println(drain(minH));
        System.out.println(drain(maxH));
    }
}

// Output:
// [1, 3, 3, 5, 8, 9]
// [9, 8, 5, 3, 3, 1]
