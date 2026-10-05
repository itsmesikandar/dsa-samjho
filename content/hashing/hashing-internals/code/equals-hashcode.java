import java.util.*;

class Main {
    static class PointBad { // equals() / hashCode() override NAHI kiye
        int x, y;

        PointBad(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    record Point(int x, int y) {} // record: equals() aur hashCode() apne aap ban jaate hain

    public static void main(String[] args) {
        Map<PointBad, String> bad = new HashMap<>();
        bad.put(new PointBad(1, 2), "ghar");
        System.out.println(bad.get(new PointBad(1, 2))); // naya object -> alag hashCode -> nahi mila!

        Map<Point, String> good = new HashMap<>();
        good.put(new Point(1, 2), "ghar");
        System.out.println(good.get(new Point(1, 2))); // same x, y -> same hashCode aur equals true

        System.out.println(new Point(1, 2).hashCode() == new Point(1, 2).hashCode());
    }
}

// Output:
// null
// ghar
// true
