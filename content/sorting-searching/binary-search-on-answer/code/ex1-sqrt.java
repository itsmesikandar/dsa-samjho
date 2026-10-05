class Main {
    // x ka square root, neeche ki taraf poora number (library sqrt ke bina)
    static int mySqrt(int x) {
        int lo = 0, hi = x;
        while (lo < hi) {
            int mid = lo + (hi - lo + 1) / 2; // UPAR round: hum 'aakhri TRUE' dhoondh rahe hain //@mid
            if ((long) mid * mid <= x) lo = mid; // mid chal gaya: answer mid ya bada //@ok
            else hi = mid - 1; // mid ka square bada: answer chhota //@big
        }
        return lo; //@done
    }

    public static void main(String[] args) {
        System.out.println(mySqrt(8));
        System.out.println(mySqrt(16));
        System.out.println(mySqrt(2147395599)); // mid * mid int mein overflow karta - isliye long
    }
}

// Output:
// 2
// 4
// 46339
