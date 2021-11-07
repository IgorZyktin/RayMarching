# RayMarching
Нахождение пересечения с фигурой методом ray marching на javascript.

Я не занимаю разработкой в области рендеринга и почти не пишу на JS. 
Просто захотелось реализовать этот алгоритм.

Логика ray marching:
1. Определяем из какой точки и в какую мы будем производить трассировку, например А-B.
1. Находим ближайшую к нам точку поверхности любого объекта.
1. Чертим окружность с центром в точке А и радиусом равным расстоянию от А до точки из п.2, пусть C.
1. Перемещаемся в точку С.
1. Повторяем шаги 2-4 до тех пор, пока расстояние до поверхности объекта не станет слишком маленьким, либо пока не превысим предел дистанции.

Ура, мы нашли пересечение!
