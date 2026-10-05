import java.util.ArrayList;
import java.util.List;

class Main {
    // n disks ko 'from' se 'to' par le jao, 'via' ki madad se. Bada disk kabhi chhote ke upar nahi.
    static void hanoi(int n, char from, char to, char via, List<String> moves) {
        if (n == 0) return; // koi disk nahi: kuch nahi karna //@base
        hanoi(n - 1, from, via, to, moves); // 1. upar ke n-1 disks raaste se hatao (via par) //@top
        moves.add("disk " + n + ": " + from + " -> " + to); // 2. sabse bada disk seedha 'to' par //@move
        hanoi(n - 1, via, to, from, moves); // 3. n-1 disks wapas bade ke upar //@back
    }

    public static void main(String[] args) {
        List<String> moves = new ArrayList<>();
        hanoi(3, 'A', 'C', 'B', moves);
        System.out.println(moves.size()); // 2^3 - 1
        for (String m : moves) System.out.println(m);
    }
}

// Output:
// 7
// disk 1: A -> C
// disk 2: A -> B
// disk 1: C -> B
// disk 3: A -> C
// disk 1: B -> A
// disk 2: B -> C
// disk 1: A -> C
