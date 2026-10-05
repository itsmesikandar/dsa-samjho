class Main {
    // Versions 1..n. Kisi version se aage sab kharab. Pehla kharab version dhoondho (API calls kam se kam).
    static class VersionControl {
        private final int firstBad;

        VersionControl(int firstBad) {
            this.firstBad = firstBad;
        }

        boolean isBadVersion(int v) {
            return v >= firstBad;
        }
    }

    static int firstBadVersion(VersionControl vc, int n) {
        int lo = 1;
        int hi = n; // n kharab hai hi - answer [lo, hi] mein pakka
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2; // n ~ 2^31: (lo + hi) overflow karega //@mid
            if (vc.isBadVersion(mid)) hi = mid; // ye kharab: pehla kharab yahi ya isse pehle //@bad
            else lo = mid + 1; // ye theek: pehla kharab iske baad //@good
        }
        return lo; //@done
    }

    public static void main(String[] args) {
        System.out.println(firstBadVersion(new VersionControl(4), 5));
        System.out.println(firstBadVersion(new VersionControl(1702766719), 2126753390));
    }
}

// Output:
// 4
// 1702766719
