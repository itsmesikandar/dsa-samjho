fun main() {
    val phone = HashMap<String, Int>() // naam -> number //@init
    phone["Ravi"] = 98100 // put: nayi key //@put
    phone["Anu"] = 99200
    phone["Ravi"] = 98111 // same key dobara -> purani value REPLACE //@update
    println(phone["Anu"]) // get: O(1) average //@get
    println(phone.getOrDefault("Kabir", -1)) // key nahi hai -> default value //@default
    println("Ravi" in phone) // containsKey //@contains
    phone.remove("Anu") //@remove
    println(phone.size)
}

// Output:
// 99200
// -1
// true
// 1
