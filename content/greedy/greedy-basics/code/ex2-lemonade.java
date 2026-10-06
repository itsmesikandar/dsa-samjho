class Main {
    // Galla: kitne 5 aur 10 ke note. 20 par 15 lautane hain - pehle 10 + 5 (10 ka note aur kisi kaam ka nahi)
    static boolean lemonadeChange(int[] bills) {
        int five = 0, ten = 0;
        for (int b : bills) {
            if (b == 5) {
                five++; // kuch lautana nahi //@five
            } else if (b == 10) {
                if (five == 0) return false; // 5 lautana tha, nahi hai //@ten
                five--;
                ten++;
            } else if (ten > 0 && five > 0) { // 20: 10 + 5 lautao - 5 ke note bachao //@twenty
                ten--;
                five--;
            } else if (five >= 3) { // 10 nahi hai to 5 + 5 + 5
                five -= 3;
            } else {
                return false; // 15 ka chhutta nahi //@fail
            }
        }
        return true; //@done
    }

    public static void main(String[] args) {
        System.out.println(lemonadeChange(new int[] {5, 5, 5, 5, 10, 20, 10}));
        System.out.println(lemonadeChange(new int[] {5, 5, 10, 10, 20}));
        System.out.println(lemonadeChange(new int[] {10}));
    }
}

// Output:
// true
// false
// false
