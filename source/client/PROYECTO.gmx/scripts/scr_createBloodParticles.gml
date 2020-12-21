/// scr_createBloodParticles( x, y, quantityRangeMin, quantityRangeMax)

var particleNumber = random_range( argument2, argument3 );

repeat(particleNumber) {
    var bloodInstance = instance_create(argument0, argument1, obj_bloodParticle);
    bloodInstance.speed = random_range(2, 10);
    bloodInstance.direction = random_range(0, 359);
    bloodInstance.friction = random_range(.5, .8);
}
