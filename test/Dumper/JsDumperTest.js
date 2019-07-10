const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
require('../../fixtures/namespace');

const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
const ServiceClosureArgument = Jymfony.Component.DependencyInjection.Argument.ServiceClosureArgument;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const JsDumper = Jymfony.Component.DependencyInjection.Dumper.JsDumper;
const Fixtures = Jymfony.Component.DependencyInjection.Fixtures;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;
const Variable = Jymfony.Component.DependencyInjection.Variable;
const fixturesPath = path.join(__dirname, '..', '..', 'fixtures');

describe('[DependencyInjection] JsDumper', function () {
    it('dump', () => {
        const container = new ContainerBuilder();
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump({ build_time: 1536621245 })).to.be.deep.equal({
            'ContainerKhcNoO4/ProjectContainer.js': fs.readFileSync(path.join(fixturesPath, 'js', 'services1.js')).toString(),
            'ProjectContainer.js': `
// This file has been auto-generated by the Jymfony Dependency Injection Component for internal use.
const ContainerKhcNoO4 = require('./ContainerKhcNoO4/ProjectContainer.js');

module.exports = new ContainerKhcNoO4({
    'container.build_hash': 'KhcNoO4',
    'container.build_id': '3918675665',
    'container.build_time': 1536621245,
});

`,
        });
        expect(dumper.dump({ class_name: 'DumpedContainer', base_class: 'AbstractContainer' })['ContainerSArL6cf/DumpedContainer.js'])
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services1-1.js')).toString());
    });

    it('dump optimization string', () => {
        const definition = new Definition();
        definition.setClass('Object');
        definition.setPublic(true);
        definition.addArgument({
            'only dot': '.',
            'concatenation as value': '+""+',
            'concatenation from the start value': '""+',
            '.': 'dot as a key',
            '+""+': 'concatenation as a key',
            '""+': 'concatenation from the start key',
            'optimize concatenation': 'string1%some_string%string2',
            'optimize concatenation with empty string': 'string1%empty_value%string2',
            'optimize concatenation from the start': '%empty_value%start',
            'optimize concatenation at the end': 'end%empty_value%',
        });

        const container = new ContainerBuilder();
        container.setResourceTracking(false);
        container.setDefinition('test', definition);
        container.setParameter('empty_value', '');
        container.setParameter('some_string', '-');
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump({ build_time: 1536621245 })['ContainermkSxLeI/ProjectContainer.js'])
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services10.js')).toString());
    });

    const tests = function * () {
        yield {'foo': new Definition('Object')};
        yield {'foo': new Reference('foo')};
        yield {'foo': new Variable('foo')};
    };
    let count = 0;

    for (const t of tests()) {
        it('should throw if invalid parameters are passed #'+count++, () => {
            const container = new ContainerBuilder(new ParameterBag(t));
            container.compile();

            const dumper = new JsDumper(container);
            expect(() => dumper.dump()).to.throw(InvalidArgumentException);
        });
    }

    it('should add parameters', () => {
        const container = require(path.join(fixturesPath, 'containers', 'container8.js'));
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump({ build_time: 1536621245 })['ContainerpzVqcDx/ProjectContainer.js'])
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services8.js')).toString());
    });

    it('should add services', () => {
        const container = require(path.join(fixturesPath, 'containers', 'container9.js'));
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump({ build_time: 1536621245 })['ContainerMAR8J0f/ProjectContainer.js'])
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services9.js')).toString());
    });

    it('should handle env parameters', () => {
        const container = require(path.join(fixturesPath, 'containers', 'container-env.js'));
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump({ build_time: 1536621245 })['Containerqb7uChl/ProjectContainer.js'])
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services-env.js')).toString());
    });

    it('should handle module inclusion', () => {
        const container = require(path.join(fixturesPath, 'containers', 'container15.js'));
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump({ build_time: 1536621245 })['ContainervtPHh8F/ProjectContainer.js'])
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services15.js')).toString());
    });

    it('should handle service locators', () => {
        const container = new ContainerBuilder();
        let nil;

        container.register('foo_service', ServiceLocator)
            .setPublic(true)
            .addArgument({
                'bar': new ServiceClosureArgument(new Reference('bar_service')),
                'baz': new ServiceClosureArgument(new Reference('baz_service', 'stdClass')),
                'nil': nil = new ServiceClosureArgument(new Reference('nil')),
            })
        ;

        // No method calls
        container.register('translator.loader_1', 'stdClass').setPublic(true);
        container.register('translator.loader_1_locator', ServiceLocator)
            .setPublic(false)
            .addArgument({
                'translator.loader_1': new ServiceClosureArgument(new Reference('translator.loader_1')),
            });
        container.register('translator_1', Fixtures.StubbedTranslator)
            .setPublic(true)
            .addArgument(new Reference('translator.loader_1_locator'));

        // One method calls
        container.register('translator.loader_2', 'stdClass').setPublic(true);
        container.register('translator.loader_2_locator', ServiceLocator)
            .setPublic(false)
            .addArgument({
                'translator.loader_2': new ServiceClosureArgument(new Reference('translator.loader_2')),
            });

        container.register('translator_2', Fixtures.StubbedTranslator)
            .setPublic(true)
            .addArgument(new Reference('translator.loader_2_locator'))
            .addMethodCall('addResource', [ 'db', new Reference('translator.loader_2'), 'nl' ]);

        // Two method calls
        container.register('translator.loader_3', 'stdClass').setPublic(true);
        container.register('translator.loader_3_locator', ServiceLocator)
            .setPublic(false)
            .addArgument({
                'translator.loader_3': new ServiceClosureArgument(new Reference('translator.loader_3')),
            });
        container.register('translator_3', Fixtures.StubbedTranslator)
            .setPublic(true)
            .addArgument(new Reference('translator.loader_3_locator'))
            .addMethodCall('addResource', [ 'db', new Reference('translator.loader_3'), 'nl' ])
            .addMethodCall('addResource', [ 'db', new Reference('translator.loader_3'), 'en' ]);

        nil.values = [ undefined ];
        container.register('bar_service', 'stdClass').setArguments([ new Reference('baz_service') ]).setPublic(true);
        container.register('baz_service', 'stdClass').setPublic(false);
        container.compile();

        const dumper = new JsDumper(container);

        expect(dumper.dump({ build_time: 1536621245 })['Container1hrtX5g/ProjectContainer.js'])
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services-locator.js')).toString());
    });

    it('should handle service subscriber', () => {
        const container = new ContainerBuilder();
        container.register('foo_service', Fixtures.TestServiceSubscriber)
            .setPublic(true)
            .addArgument(new Reference(ContainerInterface))
            .addTag('container.service_subscriber')
        ;

        container.register(Fixtures.TestServiceSubscriber, Fixtures.TestServiceSubscriber).setPublic(true);
        container.register(Fixtures.CustomDefinition, Fixtures.CustomDefinition).setPublic(false);
        container.compile();

        const dumper = new JsDumper(container);

        expect(dumper.dump({ build_time: 1536621245 })['Container4l3ewdB/ProjectContainer.js'])
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services-subscriber.js')).toString());
    });
});
