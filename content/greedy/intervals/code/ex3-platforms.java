import java.util.Arrays;

class Main {
    // Ek saath station par kitni trains? Aane aur jaane ke time ALAG ALAG sort karo, time ke order mein chalo
    static int minPlatforms(int[] arr, int[] dep) {
        Arrays.sort(arr);
        Arrays.sort(dep); //@sort
        int i = 0, j = 0;
        int now = 0; // abhi station par kitni trains
        int best = 0;
        while (i < arr.length) {
            if (arr[i] <= dep[j]) { // agli event ek train ka AANA (barabar time: pehle aayi maano - platform chahiye)
                now++; //@arrive
                i++;
            } else { // pehle koi train JAAYEGI - platform khaali
                now--; //@leave
                j++;
            }
            best = Math.max(best, now); //@best
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(minPlatforms(new int[] {9, 9, 11, 12, 15, 10}, new int[] {10, 12, 13, 14, 16, 11}));
        System.out.println(minPlatforms(new int[] {9, 11, 13}, new int[] {10, 12, 14}));
    }
}

// Output:
// 3
// 1
