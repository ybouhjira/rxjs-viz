import './style.css'
import * as d3 from 'd3';
import {fromEvent, interval, throttle, merge, map, debounce} from 'rxjs';

d3.select('body')
    .append('svg')
    .attr('width', "100%")
    .attr('height', "100%")

const $clicks = fromEvent(window, 'keydown').pipe(map(() => ({x: 100, y: 100})))

const operators = {
    throttle: throttle(() => interval(1000)),
    debounce: debounce(() => interval(1000))
};

Object.keys(operators).map((op) => String(op))
    .forEach((str, index) => {
        d3.select('svg').append('text').text(str).attr('x', 10).attr('y', 200 + 100 * index)
    })

merge(
    $clicks,
    ...Object.values(operators)
        .map((op, index) => $clicks.pipe(map(({x}) => ({x, y: 200 + 100 * index}))).pipe(op))

).subscribe(
    (d: any) => {

        d3.select('svg')
            .append('circle')

            .property('__data__', d)
            .attr('r', 10)
            .attr('cx', () => d.x)
            .attr('cy', () => d.y)
            .attr('fill', '#ff6900')

            .transition()
            .duration(500)
            .attr('r', 20)


    }
)


function animate() {
    requestAnimationFrame(animate);

    // move circle x by 1
    d3.selectAll('circle')
        .attr('cx', (d: any) => d.x += 1)
}

animate();
