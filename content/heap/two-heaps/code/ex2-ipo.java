import java.util.Collections;
import java.util.Comparator;
import java.util.PriorityQueue;

class Main {
    // Locked: capital par min-heap (sabse sasta pehle khulta hai). Ready: profit par max-heap (sabse kamau pehle)
    static int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        PriorityQueue<Integer> locked = new PriorityQueue<>(Comparator.comparingInt(i -> capital[i])); // project index //@init
        PriorityQueue<Integer> ready = new PriorityQueue<>(Collections.reverseOrder()); // afford hone wale projects ke profit
        for (int i = 0; i < profits.length; i++) locked.add(i);
        int money = w;
        for (int round = 1; round <= k; round++) {
            while (!locked.isEmpty() && capital[locked.peek()] <= money) { // paisa kaafi - project khul gaya //@unlock
                ready.add(profits[locked.poll()]);
            }
            if (ready.isEmpty()) break; // kuch afford nahi - paisa badhega hi nahi, ruko //@stuck
            money += ready.poll(); // khule hue mein sabse zyada profit wala karo //@pick
        }
        return money; //@done
    }

    public static void main(String[] args) {
        System.out.println(findMaximizedCapital(3, 1, new int[] {3, 5, 2, 7, 1}, new int[] {0, 2, 1, 6, 3}));
        System.out.println(findMaximizedCapital(2, 0, new int[] {5, 4}, new int[] {1, 2}));
        System.out.println(findMaximizedCapital(5, 0, new int[] {1, 2, 3}, new int[] {0, 1, 1}));
    }
}

// Output:
// 16
// 0
// 6
